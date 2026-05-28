"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { unlink } from "node:fs/promises";
import path from "node:path";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type ActionResult = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function emptyToNull(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function optionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function optionalPrice(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

const kostSchema = z
  .object({
    name: z.string().trim().min(3, "Nama kost minimal 3 karakter"),
    contactWhatsapp: z
      .string()
      .trim()
      .min(8, "Nomor WhatsApp minimal 8 digit")
      .regex(/^[0-9+\-\s()]+$/, "Nomor WhatsApp tidak valid"),
    description: z.string().trim().nullable(),
    regionId: z.string().min(1, "Wilayah wajib dipilih"),
    genderType: z.enum(["PUTRA", "PUTRI", "CAMPUR"], {
      message: "Tipe penghuni wajib dipilih",
    }),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
      message: "Status wajib dipilih",
    }),
    monthlyPrice: z.number().min(0, "Harga tidak boleh negatif").nullable(),
    threeMonthPrice: z.number().min(0, "Harga tidak boleh negatif").nullable(),
    sixMonthPrice: z.number().min(0, "Harga tidak boleh negatif").nullable(),
    yearlyPrice: z.number().min(0, "Harga tidak boleh negatif").nullable(),
    roomSize: z.string().trim().nullable(),
    distanceToCampusInMeters: z
      .number()
      .min(0, "Jarak tidak boleh negatif")
      .nullable(),
    googleMapsUrl: z
      .string()
      .trim()
      .nullable()
      .refine(
        (value) => {
          if (!value) {
            return true;
          }

          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Link Google Maps harus berupa URL yang valid",
        },
      ),
    waterFeeType: z.enum(["INCLUDED", "NOT_INCLUDED"], {
      message: "Biaya air wajib dipilih",
    }),
    electricityType: z.enum(["INCLUDED", "TOKEN", "SEPARATE"], {
      message: "Listrik wajib dipilih",
    }),
    isFeatured: z.boolean(),
    facilityIds: z.array(z.string()),
  })
  .refine(
    (data) =>
      data.monthlyPrice !== null ||
      data.threeMonthPrice !== null ||
      data.sixMonthPrice !== null ||
      data.yearlyPrice !== null,
    {
      message: "Isi minimal salah satu harga sewa",
      path: ["prices"],
    },
  );

function parseKostFormData(formData: FormData) {
  return kostSchema.safeParse({
    name: formData.get("name"),
    contactWhatsapp: formData.get("contactWhatsapp"),
    description: emptyToNull(formData.get("description")),
    regionId: formData.get("regionId"),
    genderType: formData.get("genderType"),
    status: formData.get("status"),
    monthlyPrice: optionalPrice(formData.get("monthlyPrice")),
    threeMonthPrice: optionalPrice(formData.get("threeMonthPrice")),
    sixMonthPrice: optionalPrice(formData.get("sixMonthPrice")),
    yearlyPrice: optionalPrice(formData.get("yearlyPrice")),
    roomSize: emptyToNull(formData.get("roomSize")),
    distanceToCampusInMeters: optionalNumber(
      formData.get("distanceToCampusInMeters"),
    ),
    googleMapsUrl: emptyToNull(formData.get("googleMapsUrl")),
    waterFeeType: formData.get("waterFeeType"),
    electricityType: formData.get("electricityType"),
    isFeatured: formData.get("isFeatured") === "on",
    facilityIds: formData.getAll("facilityIds").map(String),
  });
}

function buildPrices(data: {
  monthlyPrice: number | null;
  threeMonthPrice: number | null;
  sixMonthPrice: number | null;
  yearlyPrice: number | null;
}) {
  return [
    data.monthlyPrice !== null
      ? {
          type: "MONTHLY" as const,
          price: data.monthlyPrice,
        }
      : null,
    data.threeMonthPrice !== null
      ? {
          type: "THREE_MONTHS" as const,
          price: data.threeMonthPrice,
        }
      : null,
    data.sixMonthPrice !== null
      ? {
          type: "SIX_MONTHS" as const,
          price: data.sixMonthPrice,
        }
      : null,
    data.yearlyPrice !== null
      ? {
          type: "YEARLY" as const,
          price: data.yearlyPrice,
        }
      : null,
  ].filter(Boolean) as {
    type: "MONTHLY" | "THREE_MONTHS" | "SIX_MONTHS" | "YEARLY";
    price: number;
  }[];
}

export async function createKostAction(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseKostFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data yang diisi",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const baseSlug = slugify(data.name);

  const existingSlug = await prisma.kost.findUnique({
    where: {
      slug: baseSlug,
    },
  });

  const slug = existingSlug ? `${baseSlug}-${Date.now()}` : baseSlug;

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sesi admin tidak valid. Silakan login ulang.",
    };
  }

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
      isFeatured: data.isFeatured,
      regionId: data.regionId,
      createdById: session.user.id,
      prices: {
        create: buildPrices(data),
      },
      facilities: {
        create: data.facilityIds.map((facilityId) => ({
          facilityId,
        })),
      },
    },
  });

  revalidatePath("/admin/kost");
  revalidatePath("/");
  revalidatePath("/kost");

  return {
    success: true,
    message: "Kost berhasil ditambahkan",
  };
}

export async function updateKostAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseKostFormData(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Periksa kembali data yang diisi",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const existingKost = await prisma.kost.findUnique({
    where: {
      id,
    },
  });

  if (!existingKost) {
    return {
      success: false,
      message: "Data kost tidak ditemukan",
    };
  }

  const newBaseSlug = slugify(data.name);
  const shouldUpdateSlug = existingKost.name !== data.name;

  let slug = existingKost.slug;

  if (shouldUpdateSlug) {
    const sameSlugKost = await prisma.kost.findFirst({
      where: {
        slug: newBaseSlug,
        id: {
          not: id,
        },
      },
    });

    slug = sameSlugKost ? `${newBaseSlug}-${Date.now()}` : newBaseSlug;
  }

  await prisma.$transaction([
    prisma.kostPrice.deleteMany({
      where: {
        kostId: id,
      },
    }),

    prisma.kostFacility.deleteMany({
      where: {
        kostId: id,
      },
    }),

    prisma.kost.update({
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
        isFeatured: data.isFeatured,
        regionId: data.regionId,
        prices: {
          create: buildPrices(data),
        },
        facilities: {
          create: data.facilityIds.map((facilityId) => ({
            facilityId,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/kost");
  revalidatePath("/");
  revalidatePath("/kost");
  revalidatePath(`/kost/${slug}`);

  return {
    success: true,
    message: "Kost berhasil diperbarui",
  };
}
export async function deleteKostAction(id: string): Promise<ActionResult> {
  try {
    const kost = await prisma.kost.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });

    if (!kost) {
      return {
        success: false,
        message: "Data kost tidak ditemukan",
      };
    }

    await prisma.$transaction([
      prisma.kostImage.deleteMany({
        where: {
          kostId: id,
        },
      }),

      prisma.kostPrice.deleteMany({
        where: {
          kostId: id,
        },
      }),

      prisma.kostFacility.deleteMany({
        where: {
          kostId: id,
        },
      }),

      prisma.kost.delete({
        where: {
          id,
        },
      }),
    ]);

    await Promise.all(
      kost.images.map(async (image) => {
        if (!image.url.startsWith("/uploads/")) {
          return;
        }

        const filePath = path.join(process.cwd(), "public", image.url);

        try {
          await unlink(filePath);
        } catch {
          // File mungkin sudah tidak ada, jadi abaikan agar proses hapus data tetap berhasil.
        }
      }),
    );

    revalidatePath("/admin/kost");
    revalidatePath("/");
    revalidatePath("/kost");

    return {
      success: true,
      message: "Kost berhasil dihapus",
    };
  } catch {
    return {
      success: false,
      message: "Gagal menghapus kost",
    };
  }
}
