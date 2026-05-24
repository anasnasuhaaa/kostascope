"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { facilitySchema } from "./schema";

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
    const existing = await prisma.facility.findUnique({
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

export async function createFacilityAction(formData: FormData) {
  await requireAdmin();

  const parsed = facilitySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Nama fasilitas tidak valid",
    };
  }

  const slug = await generateUniqueSlug(parsed.data.name);

  await prisma.facility.create({
    data: {
      name: parsed.data.name,
      slug,
    },
  });

  revalidatePath("/admin/facilities");

  return {
    success: true,
    message: "Fasilitas berhasil ditambahkan",
  };
}

export async function updateFacilityAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = facilitySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Nama fasilitas tidak valid",
    };
  }

  const facility = await prisma.facility.findUnique({
    where: {
      id,
    },
  });

  if (!facility) {
    return {
      success: false,
      message: "Fasilitas tidak ditemukan",
    };
  }

  const slug = await generateUniqueSlug(parsed.data.name, id);

  await prisma.facility.update({
    where: {
      id,
    },
    data: {
      name: parsed.data.name,
      slug,
    },
  });

  revalidatePath("/admin/facilities");

  return {
    success: true,
    message: "Fasilitas berhasil diperbarui",
  };
}

export async function deleteFacilityAction(id: string) {
  await requireAdmin();

  const facility = await prisma.facility.findUnique({
    where: {
      id,
    },
  });

  if (!facility) {
    return {
      success: false,
      message: "Fasilitas tidak ditemukan",
    };
  }

  const kostCount = await prisma.kostFacility.count({
    where: {
      facilityId: id,
    },
  });

  if (kostCount > 0) {
    return {
      success: false,
      message: "Fasilitas tidak bisa dihapus karena masih digunakan data kost",
    };
  }

  await prisma.facility.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/facilities");

  return {
    success: true,
    message: "Fasilitas berhasil dihapus",
  };
}