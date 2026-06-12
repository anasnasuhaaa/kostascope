import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type WhatsappRedirectRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SelectedPublicRelation = {
  whatsapp: string;
  kostName: string;
  regionName: string;
};

const MAX_TRANSACTION_RETRIES = 3;

function buildWhatsappUrl({
  whatsapp,
  kostName,
  regionName,
}: SelectedPublicRelation) {
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");

  const message = encodeURIComponent(
    [
      "Halo Kak,",
      "",
      `Saya tertarik dengan informasi ${kostName} yang saya lihat di AngkasaKost.`,
      `Wilayah: ${regionName}.`,
      "",
      "Saya ingin meminta informasi lebih lanjut,",
      "",
      "Terima kasih.",
    ].join("\n"),
  );

  return `https://wa.me/${cleanWhatsapp}?text=${message}`;
}

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
          name: true,

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
        kostName: kost.name,
        regionName: kost.region.name,
      };
    },
    {
      isolationLevel: "Serializable",
    },
  );
}

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

export async function GET(
  request: Request,
  { params }: WhatsappRedirectRouteProps,
) {
  const { slug } = await params;

  try {
    const selectedPublicRelation =
      await selectPublicRelationWithRetry(slug);

    if (!selectedPublicRelation) {
      return NextResponse.redirect(
        new URL(
          `/kost/${slug}?contact=unavailable`,
          request.url,
        ),
      );
    }

    return NextResponse.redirect(
      buildWhatsappUrl(selectedPublicRelation),
    );
  } catch (error) {
    console.error(
      "WHATSAPP_PUBLIC_RELATION_REDIRECT_ERROR",
      error,
    );

    return NextResponse.redirect(
      new URL(
        `/kost/${slug}?contact=error`,
        request.url,
      ),
    );
  }
}