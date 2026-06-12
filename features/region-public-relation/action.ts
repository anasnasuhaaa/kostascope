"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type PublicRelationActionResult = {
  success: boolean;
  message: string;
};

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Menghapus karakter selain angka.
 *
 * Contoh:
 * +62 812-3456-7890
 * menjadi:
 * 6281234567890
 */
function normalizeWhatsapp(value: string) {
  return value.replace(/\D/g, "");
}

/**
 * Format nomor yang diterima:
 * - diawali 628
 * - hanya angka
 * - panjang total 10–15 digit
 */
function isValidWhatsapp(value: string) {
  return /^628\d{7,12}$/.test(value);
}

function revalidateRegionPages() {
  revalidatePath("/admin/region");
  revalidatePath("/admin/regions");
  revalidatePath("/kost");
}

/**
 * ============================================================
 * TAMBAH PUBLIC RELATION
 * ============================================================
 */
export async function createRegionPublicRelationAction(
  regionId: string,
  formData: FormData,
): Promise<PublicRelationActionResult> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();

    const whatsapp = normalizeWhatsapp(
      String(formData.get("whatsapp") ?? ""),
    );

    if (!name) {
      return {
        success: false,
        message: "Nama Public Relation wajib diisi",
      };
    }

    if (!isValidWhatsapp(whatsapp)) {
      return {
        success: false,
        message:
          "Nomor WhatsApp harus menggunakan format 628..., tanpa spasi atau tanda baca",
      };
    }

    const region = await prisma.region.findUnique({
      where: {
        id: regionId,
      },
      select: {
        id: true,
      },
    });

    if (!region) {
      return {
        success: false,
        message: "Wilayah tidak ditemukan",
      };
    }

    const existingPublicRelation =
      await prisma.regionPublicRelation.findUnique({
        where: {
          regionId_whatsapp: {
            regionId,
            whatsapp,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingPublicRelation) {
      return {
        success: false,
        message:
          "Nomor WhatsApp tersebut sudah terdaftar pada wilayah ini",
      };
    }

    await prisma.regionPublicRelation.create({
      data: {
        regionId,
        name,
        whatsapp,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: "Public Relation berhasil ditambahkan",
    };
  } catch (error) {
    console.error("CREATE_REGION_PUBLIC_RELATION_ERROR", error);

    return {
      success: false,
      message: "Public Relation gagal ditambahkan",
    };
  }
}

/**
 * ============================================================
 * EDIT PUBLIC RELATION
 * ============================================================
 */
export async function updateRegionPublicRelationAction(
  publicRelationId: string,
  formData: FormData,
): Promise<PublicRelationActionResult> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();

    const whatsapp = normalizeWhatsapp(
      String(formData.get("whatsapp") ?? ""),
    );

    if (!name) {
      return {
        success: false,
        message: "Nama Public Relation wajib diisi",
      };
    }

    if (!isValidWhatsapp(whatsapp)) {
      return {
        success: false,
        message:
          "Nomor WhatsApp harus menggunakan format 628..., tanpa spasi atau tanda baca",
      };
    }

    const publicRelation =
      await prisma.regionPublicRelation.findUnique({
        where: {
          id: publicRelationId,
        },
        select: {
          id: true,
          regionId: true,
        },
      });

    if (!publicRelation) {
      return {
        success: false,
        message: "Public Relation tidak ditemukan",
      };
    }

    const duplicatePublicRelation =
      await prisma.regionPublicRelation.findFirst({
        where: {
          regionId: publicRelation.regionId,
          whatsapp,
          NOT: {
            id: publicRelationId,
          },
        },
        select: {
          id: true,
        },
      });

    if (duplicatePublicRelation) {
      return {
        success: false,
        message:
          "Nomor WhatsApp tersebut sudah digunakan oleh Public Relation lain pada wilayah ini",
      };
    }

    await prisma.regionPublicRelation.update({
      where: {
        id: publicRelationId,
      },
      data: {
        name,
        whatsapp,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: "Public Relation berhasil diperbarui",
    };
  } catch (error) {
    console.error("UPDATE_REGION_PUBLIC_RELATION_ERROR", error);

    return {
      success: false,
      message: "Public Relation gagal diperbarui",
    };
  }
}

/**
 * ============================================================
 * AKTIFKAN ATAU NONAKTIFKAN PUBLIC RELATION
 * ============================================================
 *
 * Gunakan nonaktif jika PR sedang tidak bertugas.
 * Assignment lama tetap tersimpan untuk kebutuhan audit.
 */
export async function toggleRegionPublicRelationAction(
  publicRelationId: string,
): Promise<PublicRelationActionResult> {
  try {
    await requireAdmin();

    const publicRelation =
      await prisma.regionPublicRelation.findUnique({
        where: {
          id: publicRelationId,
        },
      });

    if (!publicRelation) {
      return {
        success: false,
        message: "Public Relation tidak ditemukan",
      };
    }

    if (publicRelation.isActive) {
      const activePublicRelationCount =
        await prisma.regionPublicRelation.count({
          where: {
            regionId: publicRelation.regionId,
            isActive: true,
          },
        });

      if (activePublicRelationCount <= 1) {
        return {
          success: false,
          message:
            "Minimal harus ada satu Public Relation aktif pada setiap wilayah",
        };
      }
    }

    await prisma.regionPublicRelation.update({
      where: {
        id: publicRelationId,
      },
      data: {
        isActive: !publicRelation.isActive,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: publicRelation.isActive
        ? "Public Relation berhasil dinonaktifkan"
        : "Public Relation berhasil diaktifkan",
    };
  } catch (error) {
    console.error("TOGGLE_REGION_PUBLIC_RELATION_ERROR", error);

    return {
      success: false,
      message: "Status Public Relation gagal diubah",
    };
  }
}

/**
 * ============================================================
 * HAPUS PUBLIC RELATION
 * ============================================================
 *
 * Penghapusan hanya diperbolehkan jika masih terdapat PR lain.
 * Untuk PR yang sementara tidak bertugas, gunakan nonaktifkan.
 */
export async function deleteRegionPublicRelationAction(
  publicRelationId: string,
): Promise<PublicRelationActionResult> {
  try {
    await requireAdmin();

    const publicRelation =
      await prisma.regionPublicRelation.findUnique({
        where: {
          id: publicRelationId,
        },
      });

    if (!publicRelation) {
      return {
        success: false,
        message: "Public Relation tidak ditemukan",
      };
    }

    const publicRelationCount =
      await prisma.regionPublicRelation.count({
        where: {
          regionId: publicRelation.regionId,
        },
      });

    if (publicRelationCount <= 1) {
      return {
        success: false,
        message:
          "Public Relation terakhir tidak dapat dihapus. Tambahkan PR pengganti terlebih dahulu.",
      };
    }

    await prisma.regionPublicRelation.delete({
      where: {
        id: publicRelationId,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: "Public Relation berhasil dihapus",
    };
  } catch (error) {
    console.error("DELETE_REGION_PUBLIC_RELATION_ERROR", error);

    return {
      success: false,
      message: "Public Relation gagal dihapus",
    };
  }
}