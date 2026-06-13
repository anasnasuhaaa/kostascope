import { NextResponse } from "next/server";

import { getContactServiceStatus } from "@/lib/contact-service";
import { prisma } from "@/lib/prisma";

type DirectContactRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

function buildOwnerWhatsappUrl(
  whatsapp: string,
  kostName: string,
) {
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");

  const message = encodeURIComponent(
    [
      "Halo Bapak/Ibu,",
      "",
      `Saya tertarik dengan informasi ${kostName} yang saya lihat melalui website AngkasaKost Ormawa Eksekutif PKU IPB.`,
      "",
      "Apakah saya boleh meminta informasi lebih lanjut mengenai ketersediaan kamar, fasilitas, serta ketentuan sewanya?",
      "",
      "Terima kasih.",
    ].join("\n"),
  );

  return `https://wa.me/${cleanWhatsapp}?text=${message}`;
}

export async function GET(
  request: Request,
  { params }: DirectContactRouteProps,
) {
  const { slug } = await params;

  const serviceStatus = await getContactServiceStatus();

  if (!serviceStatus.isAvailable) {
    return NextResponse.redirect(
      new URL(
        `/kost/${slug}?contact=unavailable`,
        request.url,
      ),
    );
  }

  const kost = await prisma.kost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    select: {
      name: true,
      contactWhatsapp: true,
    },
  });

  if (!kost) {
    return NextResponse.redirect(
      new URL(`/kost/${slug}?contact=error`, request.url),
    );
  }

  return NextResponse.redirect(
    buildOwnerWhatsappUrl(
      kost.contactWhatsapp,
      kost.name,
    ),
  );
}