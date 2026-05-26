"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireSuperAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
});

const updateUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
  password: z
    .string()
    .optional()
    .transform((value) => {
      if (!value || value.trim() === "") {
        return undefined;
      }

      return value;
    })
    .pipe(z.string().min(8, "Password minimal 8 karakter").optional()),
});

function getCreatePayload(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };
}

function getUpdatePayload(formData: FormData) {
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  };
}

export async function createUserAction(formData: FormData) {
  await requireSuperAdmin();

  const parsed = createUserSchema.safeParse(getCreatePayload(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  const data = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Email sudah digunakan",
    };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    },
  });

  revalidatePath("/admin/users");

  return {
    success: true,
    message: "User berhasil ditambahkan",
  };
}

export async function updateUserAction(id: string, formData: FormData) {
  await requireSuperAdmin();

  const parsed = updateUserSchema.safeParse(getUpdatePayload(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data tidak valid",
    };
  }

  const data = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    return {
      success: false,
      message: "User tidak ditemukan",
    };
  }

  const emailUsedByOtherUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      id: {
        not: id,
      },
    },
  });

  if (emailUsedByOtherUser) {
    return {
      success: false,
      message: "Email sudah digunakan user lain",
    };
  }

  const passwordHash = data.password
    ? await bcrypt.hash(data.password, 12)
    : undefined;

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  revalidatePath("/admin/users");

  return {
    success: true,
    message: "User berhasil diperbarui",
  };
}

export async function deleteUserAction(id: string) {
  const session = await requireSuperAdmin();

  if (session.user.id === id) {
    return {
      success: false,
      message: "Kamu tidak bisa menghapus akun yang sedang digunakan",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User tidak ditemukan",
    };
  }

  await prisma.user.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/users");

  return {
    success: true,
    message: "User berhasil dihapus",
  };
}