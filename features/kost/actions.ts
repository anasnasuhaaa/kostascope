"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { kostSchema } from "./schema";

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
    const existing = await prisma.kost.findUnique({
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

function parseKostFormData(formData: FormData) {
  return kostSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    contactWhatsapp: formData.get("contactWhatsapp"),

    monthlyPrice: formData.get("monthlyPrice"),
    sixMonthPrice: formData.get("sixMonthPrice"),
    yearlyPrice: formData.get("yearlyPrice"),
    roomSize: formData.get("roomSize"),
    distanceToCampusInMeters: formData.get("distanceToCampusInMeters"),
    googleMapsUrl: formData.get("googleMapsUrl"),

    genderType: formData.get("genderType") || undefined,
    waterFeeType: formData.get("waterFeeType"),
    electricityType: formData.get("electricityType"),
    status: formData.get("status"),

    isFeatured: formData.get("isFeatured") === "on",

    regionId: formData.get("regionId"),
    facilityIds: formData.getAll("facilityIds").map(String),
  });
}

function buildPriceCreateData(data: {
  monthlyPrice?: number;
  sixMonthPrice?: number;
  yearlyPrice?: number;
}) {
  const prices = [];

  if (data.monthlyPrice) {
    prices.push({
      type: "MONTHLY" as const,
      price: data.monthlyPrice,
    });
  }

  if (data.sixMonthPrice) {
    prices.push({
      type: "SIX_MONTHS" as const,
      price: data.sixMonthPrice,
    });
  }

  if (data.yearlyPrice) {
    prices.push({
      type: "YEARLY" as const,
      price: data.yearlyPrice,
    });
  }

  return prices;
}

export async function createKostAction(formData: FormData) {
  await requireAdmin();

  const parsed = parseKostFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data kost tidak valid",
    };
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug(data.name);

 await prisma.kost.create({
  data: {
    name: data.name,
    slug,
    description: data.description,
    contactWhatsapp: data.contactWhatsapp,

    roomSize: data.roomSize,
    distanceToCampusInMeters: data.distanceToCampusInMeters,
    googleMapsUrl: data.googleMapsUrl,

    genderType: data.genderType,
    waterFeeType: data.waterFeeType,
    electricityType: data.electricityType,
    status: data.status,
    isFeatured: data.isFeatured ?? false,

    publishedAt: data.status === "PUBLISHED" ? new Date() : null,

    regionId: data.regionId,

    prices: {
      create: buildPriceCreateData(data),
    },

    facilities: {
      create: (data.facilityIds ?? []).map((facilityId) => ({
        facility: {
          connect: {
            id: facilityId,
          },
        },
      })),
    },
  },
});

  revalidatePath("/admin/kost");
  revalidatePath("/");

  return {
    success: true,
    message: "Kost berhasil ditambahkan",
  };
}

export async function updateKostAction(id: string, formData: FormData) {
  await requireAdmin();

  const parsed = parseKostFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data kost tidak valid",
    };
  }

  const existingKost = await prisma.kost.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      publishedAt: true,
    },
  });

  if (!existingKost) {
    return {
      success: false,
      message: "Data kost tidak ditemukan",
    };
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug(data.name, id);

await prisma.kost.update({
  where: {
    id,
  },
  data: {
    name: data.name,
    slug,
    description: data.description,
    contactWhatsapp: data.contactWhatsapp,

    roomSize: data.roomSize,
    distanceToCampusInMeters: data.distanceToCampusInMeters,
    googleMapsUrl: data.googleMapsUrl,

    genderType: data.genderType,
    waterFeeType: data.waterFeeType,
    electricityType: data.electricityType,
    status: data.status,
    isFeatured: data.isFeatured ?? false,

    publishedAt:
      data.status === "PUBLISHED"
        ? existingKost.publishedAt ?? new Date()
        : null,

    regionId: data.regionId,

    prices: {
      deleteMany: {},
      create: buildPriceCreateData(data),
    },

    facilities: {
      deleteMany: {},
      create: (data.facilityIds ?? []).map((facilityId) => ({
        facility: {
          connect: {
            id: facilityId,
          },
        },
      })),
    },
  },
});

  revalidatePath("/admin/kost");
  revalidatePath("/");

  return {
    success: true,
    message: "Kost berhasil diperbarui",
  };
}

export async function deleteKostAction(id: string) {
  await requireAdmin();

  const kost = await prisma.kost.findUnique({
    where: {
      id,
    },
  });

  if (!kost) {
    return {
      success: false,
      message: "Data kost tidak ditemukan",
    };
  }

  await prisma.kost.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/kost");
  revalidatePath("/");

  return {
    success: true,
    message: "Kost berhasil dihapus",
  };
}
