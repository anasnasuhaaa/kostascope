"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RegionActionResult = {
  success: boolean;
  message: string;
};

/**
 * Mengubah nama wilayah menjadi slug.
 *
 * Contoh:
 * "Babakan Tengah" → "babakan-tengah"
 */
function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Memastikan hanya pengguna yang sudah login
 * yang dapat menjalankan action admin.
 */
async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Refresh halaman yang berkaitan dengan data wilayah
 * setelah terjadi perubahan.
 */
function revalidateRegionPages() {
  revalidatePath("/admin/regions");
  revalidatePath("/");
  revalidatePath("/kost");
}

/**
 * ============================================================
 * TAMBAH WILAYAH
 * ============================================================
 *
 * Region hanya menyimpan:
 * - nama wilayah;
 * - slug.
 *
 * Public Relation ditambahkan secara terpisah melalui
 * RegionPublicRelationModal.
 */
export async function createRegionAction(
  formData: FormData,
): Promise<RegionActionResult> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      return {
        success: false,
        message: "Nama wilayah wajib diisi",
      };
    }

    const slug = createSlug(name);

    if (!slug) {
      return {
        success: false,
        message: "Nama wilayah tidak valid",
      };
    }

    const existingRegion = await prisma.region.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            slug,
          },
        ],
      },

      select: {
        id: true,
      },
    });

    if (existingRegion) {
      return {
        success: false,
        message: "Wilayah dengan nama tersebut sudah tersedia",
      };
    }

    await prisma.region.create({
      data: {
        name,
        slug,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message:
        "Wilayah berhasil ditambahkan. Silakan tambahkan Public Relation melalui tombol Kelola PR.",
    };
  } catch (error) {
    console.error("CREATE_REGION_ERROR", error);

    return {
      success: false,
      message: "Wilayah gagal ditambahkan",
    };
  }
}

/**
 * ============================================================
 * EDIT WILAYAH
 * ============================================================
 *
 * Action ini hanya mengubah nama wilayah dan slug.
 * Data Public Relation dikelola melalui action terpisah.
 */
export async function updateRegionAction(
  regionId: string,
  formData: FormData,
): Promise<RegionActionResult> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      return {
        success: false,
        message: "Nama wilayah wajib diisi",
      };
    }

    const slug = createSlug(name);

    if (!slug) {
      return {
        success: false,
        message: "Nama wilayah tidak valid",
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

    const existingRegion = await prisma.region.findFirst({
      where: {
        OR: [
          {
            name,
          },
          {
            slug,
          },
        ],

        NOT: {
          id: regionId,
        },
      },

      select: {
        id: true,
      },
    });

    if (existingRegion) {
      return {
        success: false,
        message: "Wilayah dengan nama tersebut sudah tersedia",
      };
    }

    await prisma.region.update({
      where: {
        id: regionId,
      },

      data: {
        name,
        slug,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: "Wilayah berhasil diperbarui",
    };
  } catch (error) {
    console.error("UPDATE_REGION_ERROR", error);

    return {
      success: false,
      message: "Wilayah gagal diperbarui",
    };
  }
}

/**
 * ============================================================
 * HAPUS WILAYAH
 * ============================================================
 *
 * Wilayah hanya dapat dihapus jika:
 * - tidak memiliki data kost;
 * - tidak memiliki Public Relation.
 *
 * Pemeriksaan Public Relation mencegah data PR terhapus
 * tanpa sengaja karena relasi memakai onDelete: Cascade.
 */
export async function deleteRegionAction(
  regionId: string,
): Promise<RegionActionResult> {
  try {
    await requireAdmin();

    const region = await prisma.region.findUnique({
      where: {
        id: regionId,
      },

      include: {
        _count: {
          select: {
            kosts: true,
            publicRelations: true,
          },
        },
      },
    });

    if (!region) {
      return {
        success: false,
        message: "Wilayah tidak ditemukan",
      };
    }

    if (region._count.kosts > 0) {
      return {
        success: false,
        message:
          "Wilayah tidak dapat dihapus karena masih digunakan oleh data kost",
      };
    }

    if (region._count.publicRelations > 0) {
      return {
        success: false,
        message:
          "Wilayah tidak dapat dihapus karena masih memiliki Public Relation. Hapus seluruh PR terlebih dahulu.",
      };
    }

    await prisma.region.delete({
      where: {
        id: regionId,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: "Wilayah berhasil dihapus",
    };
  } catch (error) {
    console.error("DELETE_REGION_ERROR", error);

    return {
      success: false,
      message: "Wilayah gagal dihapus",
    };
  }
}