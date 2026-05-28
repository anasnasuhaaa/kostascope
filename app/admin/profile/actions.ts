"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type ActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(60, "Nama maksimal 60 karakter"),
});

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .max(100, "Password baru terlalu panjang"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export async function updateMyProfileAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sesi tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data profil",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: parsed.data.name,
    },
  });

  revalidatePath("/admin/profile");
  revalidatePath("/admin");

  return {
    success: true,
    message:
      "Profil berhasil diperbarui. Jika nama di header belum berubah, silakan login ulang.",
  };
}

export async function updateMyPasswordAction(
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sesi tidak valid. Silakan login ulang.",
    };
  }

  const parsed = updatePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data password",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      passwordHash: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User tidak ditemukan",
    };
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.passwordHash
  );

  if (!isCurrentPasswordValid) {
    return {
      success: false,
      message: "Password lama tidak sesuai",
      fieldErrors: {
        currentPassword: ["Password lama tidak sesuai"],
      },
    };
  }

  const isSamePassword = await bcrypt.compare(
    parsed.data.newPassword,
    user.passwordHash
  );

  if (isSamePassword) {
    return {
      success: false,
      message: "Password baru tidak boleh sama dengan password lama",
      fieldErrors: {
        newPassword: ["Password baru tidak boleh sama dengan password lama"],
      },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      passwordHash,
    },
  });

  revalidatePath("/admin/profile");

  return {
    success: true,
    message: "Password berhasil diperbarui",
  };
}