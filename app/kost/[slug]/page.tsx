import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { prisma } from "@/lib/prisma";
import KostGallery from "./kost-gallery";

type DetailKostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function getPriceLabel(type: string) {
  if (type === "MONTHLY") {
    return "1 Bulan";
  }

  if (type === "THREE_MONTHS") {
    return "3 Bulan";
  }

  if (type === "SIX_MONTHS") {
    return "6 Bulan";
  }

  return "1 Tahun";
}

function getGenderLabel(genderType: string | null) {
  if (genderType === "PUTRA") {
    return "Putra";
  }

  if (genderType === "PUTRI") {
    return "Putri";
  }

  if (genderType === "CAMPUR") {
    return "Campur";
  }

  return "Umum";
}

function getGenderClassName(genderType: string | null) {
  if (genderType === "PUTRA") {
    return "bg-blue-50 text-blue-700 ring-blue-100";
  }

  if (genderType === "PUTRI") {
    return "bg-pink-50 text-pink-700 ring-pink-100";
  }

  if (genderType === "CAMPUR") {
    return "bg-yellow-50 text-yellow-700 ring-yellow-100";
  }

  return "bg-zinc-50 text-zinc-700 ring-zinc-100";
}

function getLowestPrice(prices: { price: number }[]) {
  if (prices.length === 0) {
    return null;
  }
  return Math.min(...prices.map((price) => price.price));
}
function getLowestPriceItem(
  prices: {
    type: string;
    price: number;
  }[]
) {
  if (prices.length === 0) {
    return null;
  }

  return prices.reduce((lowest, current) => {
    return current.price < lowest.price ? current : lowest;
  }, prices[0]);
}

function buildWhatsappUrl(
  phone: string,
  kostName: string,
  regionName?: string,
) {
  const cleanPhone = phone.replace(/\D/g, "");

  const message = encodeURIComponent(
    [
      "Halo Kak,",
      "",
      `Saya tertarik dengan informasi ${kostName} yang saya lihat di AngkasaKost.`,
      regionName ? `Wilayah: ${regionName}.` : null,
      "",
      "Apakah saya boleh meminta informasi lebih lanjut?",
      "",
      "Terima kasih.",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return `https://wa.me/${cleanPhone}?text=${message}`;
}

function formatWaterFee(type: string) {
  return type === "INCLUDED" ? "Sudah termasuk" : "Belum termasuk";
}

function formatElectricity(type: string) {
  if (type === "INCLUDED") {
    return "Sudah termasuk";
  }

  if (type === "TOKEN") {
    return "Token";
  }

  return "Terpisah dari harga kost";
}

function WhatsappIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.52 11.78a8.5 8.5 0 0 1-12.6 7.44L4 20.25l1.05-3.8a8.5 8.5 0 1 1 15.47-4.67Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9.35 8.45c.18-.4.37-.41.55-.41h.45c.14 0 .36.05.55.27.18.22.7.86.7 2.1 0 .15-.03.3-.1.43-.09.18-.19.31-.33.48-.1.13-.22.28-.1.5.12.22.53.88 1.14 1.43.78.7 1.44.92 1.66 1.02.22.1.35.08.48-.05.14-.15.56-.66.71-.88.15-.22.3-.18.5-.11.2.07 1.31.62 1.53.73.22.11.37.17.42.27.05.1.05.58-.13 1.14-.18.56-1.06 1.07-1.47 1.11-.38.04-.86.06-1.39-.09-.32-.1-.73-.24-1.26-.47-2.21-.95-3.65-3.18-3.76-3.33-.11-.15-.9-1.19-.9-2.27 0-1.08.57-1.61.77-1.83Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 12.2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function InfoIcon({ type }: { type: "room" | "distance" | "region" | "water" | "electricity" | "contact" }) {
  const icons = {
    room: (
      <path
        d="M4 10V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M4 10h16M4 10v10M20 10v10M8 14h8M8 18h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    distance: (
      <path
        d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
    region: (
      <path
        d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2V6ZM9 4v14M15 6v14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    water: (
      <path
        d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
    electricity: (
      <path
        d="M13 2L5 13h6l-1 9 9-13h-6l0-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    ),
    contact: (
      <path
        d="M21 15.5v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.12 2.8 2 2 0 0 1 3.11.62h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L7 8.36a16 16 0 0 0 6 6l1.29-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 21 15.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        aria-hidden="true"
      >
        {icons[type]}
      </svg>
    </div>
  );
}
export async function generateMetadata({
  params,
}: DetailKostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const kost = await prisma.kost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      name: true,
      slug: true,
      description: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
        select: {
          url: true,
          altText: true,
        },
      },
      region: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!kost) {
    return {
      title: "Kost Tidak Ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    kost.description ??
    `Lihat informasi ${kost.name} di wilayah ${kost.region.name}, termasuk harga, fasilitas, lokasi, dan kontak Public Relation melalui AngkasaKost.`;

  const mainImage = kost.images[0];

  return {
    title: `${kost.name} - Kost ${kost.region.name}`,
    description,

    alternates: {
      canonical: `/kost/${kost.slug}`,
    },

    openGraph: {
      type: "website",
      title: `${kost.name} | AngkasaKost`,
      description,
      url: `/kost/${kost.slug}`,
      images: mainImage
        ? [
            {
              url: mainImage.url,
              alt: mainImage.altText ?? kost.name,
            },
          ]
        : ["/opengraph-image.jpg"],
    },

    twitter: {
      card: "summary_large_image",
      title: `${kost.name} | AngkasaKost`,
      description,
      images: mainImage ? [mainImage.url] : ["/opengraph-image.jpg"],
    },
  };
}

export default async function DetailKostPage({ params }: DetailKostPageProps) {
  const { slug } = await params;

  const kost = await prisma.kost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      region: true,
      prices: {
        orderBy: {
          type: "asc",
        },
      },
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      facilities: {
        include: {
          facility: true,
        },
      },
    },
  });

  if (!kost) {
    notFound();
  }

  const relatedKosts = await prisma.kost.findMany({
    where: {
      status: "PUBLISHED",
      regionId: kost.regionId,
      id: {
        not: kost.id,
      },
    },
    include: {
      region: true,
      prices: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  const lowestPrice = getLowestPrice(kost.prices);
  const lowestPriceItem = getLowestPriceItem(kost.prices);
  const publicRelationWhatsapp = kost.region.publicRelationWhatsapp;

  const whatsappUrl = publicRelationWhatsapp
    ? buildWhatsappUrl(
      publicRelationWhatsapp,
      kost.name,
      kost.region.name,
    )
    : "#";

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-950">
      <SiteHeader />

      <main>
        <section className="border-b border-red-100 bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="text-sm text-zinc-500">
              <Link href="/" className="hover:text-[#BE1E2D]">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/kost" className="hover:text-[#BE1E2D]">
                Kost
              </Link>{" "}
              / <span className="text-zinc-900">{kost.name}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8 lg:py-12">
          <div className="space-y-8">
            <KostGallery kostName={kost.name} images={kost.images} />

            <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-[#BE1E2D]">
                  {kost.region.name}
                </span>

                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-black ring-1",
                    getGenderClassName(kost.genderType),
                  ].join(" ")}
                >
                  {getGenderLabel(kost.genderType)}
                </span>

                {kost.isFeatured && (
                  <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-black text-white">
                    Kost Rekomendasi
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                {kost.name}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-600">
                {kost.description ??
                  "Informasi detail kost ini tersedia melalui narahubung. Silakan hubungi kontak yang tersedia untuk informasi lebih lanjut."}
              </p>
            </div>

            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Harga Sewa</h2>
              <p className="mt-2 text-sm text-zinc-500">
                Pilihan harga yang tersedia untuk kost ini.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {kost.prices.map((price) => (
                  <div
                    key={price.id}
                    className="rounded-2xl border border-red-100 bg-linear-to-br from-white to-[#FFF7F8] p-5"
                  >
                    <p className="text-sm font-bold text-zinc-500">
                      {getPriceLabel(price.type)}
                    </p>
                    <p className="mt-2 text-2xl font-black text-[#BE1E2D]">
                      {formatRupiah(price.price)}
                    </p>
                  </div>
                ))}

                {kost.prices.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-red-200 p-5 text-sm text-zinc-500">
                    Harga belum tersedia.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Informasi Kost</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    Detail utama yang perlu kamu ketahui sebelum menghubungi narahubung.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="group rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
                  <div className="flex items-start gap-3">
                    <InfoIcon type="room" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Ukuran Kamar
                      </p>
                      <p className="mt-1 font-black text-zinc-950">
                        {kost.roomSize ?? "Belum tersedia"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
                  <div className="flex items-start gap-3">
                    <InfoIcon type="distance" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Jarak ke Kampus
                      </p>
                      <p className="mt-1 font-black text-zinc-950">
                        {kost.distanceToCampusInMeters
                          ? `${kost.distanceToCampusInMeters} meter`
                          : "Belum tersedia"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
                  <div className="flex items-start gap-3">
                    <InfoIcon type="region" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Wilayah
                      </p>
                      <p className="mt-1 font-black text-zinc-950">{kost.region.name}</p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
                  <div className="flex items-start gap-3">
                    <InfoIcon type="water" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Biaya Air
                      </p>
                      <p className="mt-1 font-black text-zinc-950">
                        {formatWaterFee(kost.waterFeeType)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
                  <div className="flex items-start gap-3">
                    <InfoIcon type="electricity" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Listrik
                      </p>
                      <p className="mt-1 font-black text-zinc-950">
                        {formatElectricity(kost.electricityType)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
                  <div className="flex items-start gap-3">
                    <InfoIcon type="contact" />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                        Public Relation Wilayah
                      </p>

                      <p className="mt-1 font-black text-zinc-950">
                        {kost.region.publicRelationName ?? "Belum tersedia"}
                      </p>

                      <p className="mt-1 wrap-break-words text-sm font-semibold text-[#BE1E2D]">
                        {kost.region.publicRelationWhatsapp ?? "Kontak belum tersedia"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Fasilitas</h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {kost.facilities.map((item) => (
                  <span
                    key={item.facilityId}
                    className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-[#BE1E2D]"
                  >
                    {item.facility.name}
                  </span>
                ))}

                {kost.facilities.length === 0 && (
                  <p className="text-sm text-zinc-500">
                    Fasilitas belum tersedia.
                  </p>
                )}
              </div>
            </section>

            {/* {relatedKosts.length > 0 && (
              <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black">Kost Lainnya</h2>
                    <p className="mt-2 text-sm text-zinc-500">
                      Rekomendasi kost lain di wilayah {kost.region.name}.
                    </p>
                  </div>

                  <Link
                    href={`/kost?regionId=${kost.regionId}`}
                    className="hidden rounded-xl border border-red-100 px-4 py-2 text-sm font-black text-[#BE1E2D] hover:bg-red-50 sm:inline-flex"
                  >
                    Lihat Semua
                  </Link>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {relatedKosts.map((item) => {
                    const image = item.images[0];
                    const price = getLowestPrice(item.prices);

                    return (
                      <Link
                        key={item.id}
                        href={`/kost/${item.slug}`}
                        className="overflow-hidden rounded-2xl border border-red-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/5"
                      >
                        <div className="relative aspect-4/3 bg-red-50">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText ?? item.name}
                              fill
                              className="object-cover"
                              sizes="300px"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm font-black text-[#BE1E2D]">
                              Kostascope
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="line-clamp-1 font-black">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-[#BE1E2D]">
                            {price ? formatRupiah(price) : "-"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )} */}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Mulai dari
              </p>

              <div className="mt-2">
                <p className="text-3xl font-black text-[#BE1E2D]">
                  {lowestPriceItem ? formatRupiah(lowestPriceItem.price) : "-"}
                </p>

                {lowestPriceItem && (
                  <p className="mt-1 text-sm font-semibold text-zinc-500">
                    / {getPriceLabel(lowestPriceItem.type)}
                  </p>
                )}
              </div>

              <div className="mt-6 grid gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] text-sm font-black text-white shadow-lg shadow-red-950/10 transition hover:bg-[#9f1725]"
                >
                  <WhatsappIcon />
                  Hubungi via WhatsApp
                </a>

                {kost.googleMapsUrl && (
                  <a
                    href={kost.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-100 text-sm font-black text-[#BE1E2D] transition hover:bg-red-50"
                  >
                    <MapIcon />
                    Buka Google Maps
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-red-100 bg-[#BE1E2D] p-6 text-white shadow-xl shadow-red-950/10">
              <h2 className="text-xl font-black">Butuh bantuan?</h2>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Hubungi narahubung untuk menanyakan ketersediaan kamar, jadwal
                survei, dan informasi tambahan lainnya.
              </p>
            </div>
          </aside>
        </section>

        {/* <div className="fixed inset-x-0 bottom-0 z-40 border-t border-red-100 bg-white/95 p-4 backdrop-blur lg:hidden">
          <div className="grid gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] text-sm font-black text-white shadow-lg shadow-red-950/10"
            >
              <WhatsappIcon />
              Hubungi via WhatsApp
            </a>

            {kost.googleMapsUrl && (
              <a
                href={kost.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white text-sm font-black text-[#BE1E2D]"
              >
                <MapIcon />
                Buka Google Maps
              </a>
            )}
          </div>
        </div> */}
      </main>

      <SiteFooter />
    </div>
  );
}