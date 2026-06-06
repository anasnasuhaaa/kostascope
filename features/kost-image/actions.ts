"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB per file
const MAX_TOTAL_UPLOAD_SIZE = 20 * 1024 * 1024; // 20 MB per request
const MAX_FILES_PER_UPLOAD = 5;

const IMAGE_EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Sebaiknya diarahkan ke folder storage permanen di luar repository.
 * Fallback dipertahankan agar tetap berjalan saat development lokal.
 */
const UPLOAD_DIR =
  process.env.KOST_UPLOAD_DIR ??
  path.join(process.cwd(), "public", "uploads", "kost");

const PUBLIC_UPLOAD_PATH = "/uploads/kost";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

function createSafeFileName(file: File) {
  const extension = IMAGE_EXTENSION_BY_TYPE[file.type];

  if (!extension) {
    throw new Error("Unsupported image type");
  }

  return `${crypto.randomUUID()}.${extension}`;
}

async function removeWrittenFiles(filePaths: string[]) {
  await Promise.allSettled(
    filePaths.map(async (filePath) => {
      await fs.unlink(filePath);
    }),
  );
}

export async function uploadKostImagesAction(
  kostId: string,
  formData: FormData,
) {
  try {
    await requireAdmin();

    const kost = await prisma.kost.findUnique({
      where: {
        id: kostId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!kost) {
      return {
        success: false,
        message: "Data kost tidak ditemukan",
      };
    }

    const files = formData
      .getAll("images")
      .filter(
        (fileValue): fileValue is File =>
          fileValue instanceof File && fileValue.size > 0,
      );

    if (files.length === 0) {
      return {
        success: false,
        message: "Pilih minimal satu gambar",
      };
    }

    if (files.length > MAX_FILES_PER_UPLOAD) {
      return {
        success: false,
        message: `Maksimal ${MAX_FILES_PER_UPLOAD} gambar dalam satu kali upload`,
      };
    }

    for (const file of files) {
      if (!IMAGE_EXTENSION_BY_TYPE[file.type]) {
        return {
          success: false,
          message: "Format gambar harus JPG, PNG, atau WebP",
        };
      }

      if (file.size > MAX_FILE_SIZE) {
        return {
          success: false,
          message: "Ukuran maksimal setiap gambar adalah 4MB",
        };
      }
    }

    const totalUploadSize = files.reduce(
      (total, file) => total + file.size,
      0,
    );

    if (totalUploadSize > MAX_TOTAL_UPLOAD_SIZE) {
      return {
        success: false,
        message: "Total ukuran gambar dalam satu kali upload maksimal 20MB",
      };
    }

    await fs.mkdir(UPLOAD_DIR, {
      recursive: true,
    });

    const existingImageCount = await prisma.kostImage.count({
      where: {
        kostId,
      },
    });

    const writtenFilePaths: string[] = [];

    try {
      const imageData = [];

      for (const [index, file] of files.entries()) {
        const fileName = createSafeFileName(file);
        const filePath = path.join(UPLOAD_DIR, fileName);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await fs.writeFile(filePath, buffer);

        writtenFilePaths.push(filePath);

        imageData.push({
          url: `${PUBLIC_UPLOAD_PATH}/${fileName}`,
          altText: kost.name,
          sortOrder: existingImageCount + index,
          kostId,
        });
      }

      await prisma.kostImage.createMany({
        data: imageData,
      });
    } catch (error) {
      await removeWrittenFiles(writtenFilePaths);
      throw error;
    }

    revalidatePath("/admin/kost");

    return {
      success: true,
      message: "Gambar kost berhasil diupload",
    };
  } catch (error) {
    console.error("UPLOAD_KOST_IMAGE_ERROR", error);

    return {
      success: false,
      message:
        "Upload gagal diproses. Periksa kapasitas storage dan konfigurasi server.",
    };
  }
}

export async function deleteKostImageAction(imageId: string) {
  try {
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

    const fileName = path.basename(image.url);
    const filePath = path.join(UPLOAD_DIR, fileName);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("DELETE_KOST_IMAGE_FILE_ERROR", error);
      // Database tetap dihapus meskipun file fisik sebelumnya sudah tidak ada.
    }

    revalidatePath("/admin/kost");

    return {
      success: true,
      message: "Gambar berhasil dihapus",
    };
  } catch (error) {
    console.error("DELETE_KOST_IMAGE_ERROR", error);

    return {
      success: false,
      message: "Gambar gagal dihapus",
    };
  }
}