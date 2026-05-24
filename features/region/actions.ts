"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { regionSchema } from "./schema";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

async function generateUniqueSlug(name: string, currentId?: string) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.region.findUnique({
      where: {
        slug,
      },
    });

    if (!existing || existing.id === currentId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function createRegionAction(formData: FormData) {
  await requireAdmin();

  const parsed = regionSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Nama wilayah tidak valid",
    };
  }

  const slug = await generateUniqueSlug(parsed.data.name);

  await prisma.region.create({
    data: {
      name: parsed.data.name,
      slug,
    },
  });

  revalidatePath("/admin/regions");

  return {
    success: true,
    message: "Wilayah berhasil ditambahkan",
  };
}

export async function updateRegionAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = regionSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Nama wilayah tidak valid",
    };
  }

  const region = await prisma.region.findUnique({
    where: {
      id,
    },
  });

  if (!region) {
    return {
      success: false,
      message: "Wilayah tidak ditemukan",
    };
  }

  const slug = await generateUniqueSlug(parsed.data.name, id);

  await prisma.region.update({
    where: {
      id,
    },
    data: {
      name: parsed.data.name,
      slug,
    },
  });

  revalidatePath("/admin/regions");

  return {
    success: true,
    message: "Wilayah berhasil diperbarui",
  };
}

export async function deleteRegionAction(id: string) {
  await requireAdmin();

  const region = await prisma.region.findUnique({
    where: {
      id,
    },
  });

  if (!region) {
    return {
      success: false,
      message: "Wilayah tidak ditemukan",
    };
  }

  const kostCount = await prisma.kost.count({
    where: {
      regionId: id,
    },
  });

  if (kostCount > 0) {
    return {
      success: false,
      message: "Wilayah tidak bisa dihapus karena masih digunakan data kost",
    };
  }

  await prisma.region.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/regions");

  return {
    success: true,
    message: "Wilayah berhasil dihapus",
  };
}