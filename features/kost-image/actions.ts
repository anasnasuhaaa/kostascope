"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

function getFileExtension(file: File) {
  const fileName = file.name;
  const extension = fileName.split(".").pop();

  if (!extension) {
    return "jpg";
  }

  return extension.toLowerCase();
}

function createSafeFileName(file: File) {
  const extension = getFileExtension(file);
  const randomName = crypto.randomUUID();

  return `${randomName}.${extension}`;
}

export async function uploadKostImagesAction(kostId: string, formData: FormData) {
  await requireAdmin();

  const kost = await prisma.kost.findUnique({
    where: {
      id: kostId,
    },
  });

  if (!kost) {
    return {
      success: false,
      message: "Data kost tidak ditemukan",
    };
  }

  const files = formData.getAll("images");

  if (files.length === 0) {
    return {
      success: false,
      message: "Pilih minimal satu gambar",
    };
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "kost");

  await fs.mkdir(uploadDir, {
    recursive: true,
  });

  const existingImageCount = await prisma.kostImage.count({
    where: {
      kostId,
    },
  });

  const imageData: {
    url: string;
    altText: string;
    sortOrder: number;
    kostId: string;
  }[] = [];

  for (const [index, fileValue] of files.entries()) {
    if (!(fileValue instanceof File)) {
      continue;
    }

    if (fileValue.size === 0) {
      continue;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(fileValue.type)) {
      return {
        success: false,
        message: "Format gambar harus JPG, PNG, atau WebP",
      };
    }

    if (fileValue.size > MAX_FILE_SIZE) {
      return {
        success: false,
        message: "Ukuran maksimal setiap gambar adalah 2MB",
      };
    }

    const fileName = createSafeFileName(fileValue);
    const filePath = path.join(uploadDir, fileName);

    const bytes = await fileValue.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    imageData.push({
      url: `/uploads/kost/${fileName}`,
      altText: kost.name,
      sortOrder: existingImageCount + index,
      kostId,
    });
  }

  if (imageData.length === 0) {
    return {
      success: false,
      message: "Tidak ada gambar valid yang diupload",
    };
  }

  await prisma.kostImage.createMany({
    data: imageData,
  });

  revalidatePath("/admin/kost");

  return {
    success: true,
    message: "Gambar kost berhasil diupload",
  };
}

export async function deleteKostImageAction(imageId: string) {
  await requireAdmin();

  const image = await prisma.kostImage.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    return {
      success: false,
      message: "Gambar tidak ditemukan",
    };
  }

  await prisma.kostImage.delete({
    where: {
      id: imageId,
    },
  });

  const relativePath = image.url.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relativePath);

  try {
    await fs.unlink(filePath);
  } catch {
    // File fisik mungkin sudah tidak ada, tapi data database tetap sudah dihapus.
  }

  revalidatePath("/admin/kost");

  return {
    success: true,
    message: "Gambar berhasil dihapus",
  };
}