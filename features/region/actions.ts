"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RegionActionResult = {
  success: boolean;
  message: string;
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeWhatsapp(value: string) {
  return value.replace(/\D/g, "");
}

function isValidWhatsapp(value: string) {
  return /^628\d{7,13}$/.test(value);
}

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

function revalidateRegionPages() {
  revalidatePath("/admin/regions");
  revalidatePath("/");
  revalidatePath("/kost");
}

export async function createRegionAction(
  formData: FormData,
): Promise<RegionActionResult> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const publicRelationName = String(
      formData.get("publicRelationName") ?? "",
    ).trim();

    const publicRelationWhatsapp = normalizeWhatsapp(
      String(formData.get("publicRelationWhatsapp") ?? ""),
    );

    if (!name) {
      return {
        success: false,
        message: "Nama wilayah wajib diisi",
      };
    }

    if (!publicRelationName) {
      return {
        success: false,
        message: "Nama Public Relation wajib diisi",
      };
    }

    if (!isValidWhatsapp(publicRelationWhatsapp)) {
      return {
        success: false,
        message:
          "Nomor WhatsApp Public Relation harus menggunakan format 628..., tanpa spasi atau tanda baca",
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
        OR: [{ name }, { slug }],
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
        publicRelationName,
        publicRelationWhatsapp,
      },
    });

    revalidateRegionPages();

    return {
      success: true,
      message: "Wilayah berhasil ditambahkan",
    };
  } catch (error) {
    console.error("CREATE_REGION_ERROR", error);

    return {
      success: false,
      message: "Wilayah gagal ditambahkan",
    };
  }
}

export async function updateRegionAction(
  regionId: string,
  formData: FormData,
): Promise<RegionActionResult> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") ?? "").trim();
    const publicRelationName = String(
      formData.get("publicRelationName") ?? "",
    ).trim();

    const publicRelationWhatsapp = normalizeWhatsapp(
      String(formData.get("publicRelationWhatsapp") ?? ""),
    );

    if (!name) {
      return {
        success: false,
        message: "Nama wilayah wajib diisi",
      };
    }

    if (!publicRelationName) {
      return {
        success: false,
        message: "Nama Public Relation wajib diisi",
      };
    }

    if (!isValidWhatsapp(publicRelationWhatsapp)) {
      return {
        success: false,
        message:
          "Nomor WhatsApp Public Relation harus menggunakan format 628..., tanpa spasi atau tanda baca",
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
        OR: [{ name }, { slug }],
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
        publicRelationName,
        publicRelationWhatsapp,
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