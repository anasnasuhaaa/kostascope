import { NextResponse } from "next/server";

import { getContactServiceStatus } from "@/lib/contact-service";
import { prisma } from "@/lib/prisma";

type FinderContactRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SelectedPublicRelation = {
  whatsapp: string;
  regionName: string;
};

type FinderFormData = {
  customerName: string;
  studyProgram: string;
  cohort: string;
};

const MAX_TRANSACTION_RETRIES = 3;

/**
 * Bersihkan input teks menjadi satu baris.
 */
function normalizeSingleLine(
  value: FormDataEntryValue | null,
) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}

/**
 * Ambil dan validasi form user.
 */
function parseFinderFormData(
  formData: FormData,
): FinderFormData | null {
  const customerName = normalizeSingleLine(
    formData.get("customerName"),
  );

  const studyProgram = normalizeSingleLine(
    formData.get("studyProgram"),
  );

  const cohort = normalizeSingleLine(
    formData.get("cohort"),
  );

  if (
    !customerName ||
    customerName.length > 80 ||
    !studyProgram ||
    studyProgram.length > 100 ||
    !/^\d{2,4}$/.test(cohort)
  ) {
    return null;
  }

  return {
    customerName,
    studyProgram,
    cohort,
  };
}

/**
 * Susun pesan WhatsApp untuk layanan Kost Finder.
 */
function buildFinderWhatsappUrl({
  whatsapp,
  regionName,
  customerName,
  studyProgram,
  cohort,
}: SelectedPublicRelation & FinderFormData) {
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");

  const message = encodeURIComponent(
    [
      "Halo Kak,",
      "",
      `Saya ${customerName} dari Program Studi ${studyProgram}, angkatan ${cohort}.`,
      `Saya tertarik menggunakan layanan Kost Finder AngkasaKost untuk mencari hunian di wilayah ${regionName}.`,
      "",
      "Bolehkah saya meminta informasi lebih lanjut mengenai alur layanan dan pilihan kost yang tersedia?",
      "",
      "Terima kasih.",
    ].join("\n"),
  );

  return `https://wa.me/${cleanWhatsapp}?text=${message}`;
}

/**
 * Pilih Public Relation aktif dengan jumlah assignment
 * paling sedikit.
 *
 * Jika terdapat beberapa kandidat dengan jumlah yang sama,
 * pilih salah satunya secara acak.
 */
async function selectPublicRelation(
  slug: string,
): Promise<SelectedPublicRelation | null> {
  return prisma.$transaction(
    async (transaction) => {
      const kost = await transaction.kost.findFirst({
        where: {
          slug,
          status: "PUBLISHED",
        },

        select: {
          region: {
            select: {
              name: true,

              publicRelations: {
                where: {
                  isActive: true,
                },

                select: {
                  id: true,
                  whatsapp: true,
                  assignmentCount: true,
                },
              },
            },
          },
        },
      });

      if (!kost) {
        return null;
      }

      const publicRelations =
        kost.region.publicRelations;

      if (publicRelations.length === 0) {
        return null;
      }

      const minimumAssignmentCount = Math.min(
        ...publicRelations.map(
          (publicRelation) =>
            publicRelation.assignmentCount,
        ),
      );

      const candidates = publicRelations.filter(
        (publicRelation) =>
          publicRelation.assignmentCount ===
          minimumAssignmentCount,
      );

      const selectedPublicRelation =
        candidates[
          Math.floor(Math.random() * candidates.length)
        ];

      await transaction.regionPublicRelation.update({
        where: {
          id: selectedPublicRelation.id,
        },

        data: {
          assignmentCount: {
            increment: 1,
          },

          lastAssignedAt: new Date(),
        },
      });

      return {
        whatsapp: selectedPublicRelation.whatsapp,
        regionName: kost.region.name,
      };
    },
    {
      isolationLevel: "Serializable",
    },
  );
}

/**
 * Ulangi transaction apabila terdapat write conflict
 * ketika beberapa user mengakses layanan bersamaan.
 */
async function selectPublicRelationWithRetry(
  slug: string,
) {
  for (
    let attempt = 1;
    attempt <= MAX_TRANSACTION_RETRIES;
    attempt += 1
  ) {
    try {
      return await selectPublicRelation(slug);
    } catch (error) {
      const errorCode =
        typeof error === "object" &&
        error !== null &&
        "code" in error
          ? String(error.code)
          : "";

      if (
        errorCode !== "P2034" ||
        attempt === MAX_TRANSACTION_RETRIES
      ) {
        throw error;
      }
    }
  }

  return null;
}

/**
 * ============================================================
 * POST /api/kost/[slug]/contact/finder
 * ============================================================
 */
export async function POST(
  request: Request,
  { params }: FinderContactRouteProps,
) {
  const { slug } = await params;

  try {
    /**
     * Cek ulang jam layanan pada server.
     * Jangan hanya mengandalkan pengecekan pada browser.
     */
    const serviceStatus =
      await getContactServiceStatus();

    if (!serviceStatus.isAvailable) {
      return NextResponse.redirect(
        new URL(
          `/kost/${slug}?contact=unavailable`,
          request.url,
        ),
        303,
      );
    }

    const formData = await request.formData();

    const parsedFormData =
      parseFinderFormData(formData);

    if (!parsedFormData) {
      return NextResponse.redirect(
        new URL(
          `/kost/${slug}?contact=invalid-form`,
          request.url,
        ),
        303,
      );
    }

    const selectedPublicRelation =
      await selectPublicRelationWithRetry(slug);

    if (!selectedPublicRelation) {
      return NextResponse.redirect(
        new URL(
          `/kost/${slug}?contact=unavailable`,
          request.url,
        ),
        303,
      );
    }

    return NextResponse.redirect(
      buildFinderWhatsappUrl({
        ...selectedPublicRelation,
        ...parsedFormData,
      }),
      303,
    );
  } catch (error) {
    console.error(
      "FINDER_CONTACT_REDIRECT_ERROR",
      error,
    );

    return NextResponse.redirect(
      new URL(
        `/kost/${slug}?contact=error`,
        request.url,
      ),
      303,
    );
  }
}