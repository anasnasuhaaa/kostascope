import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ElementType } from "react";
import {
  Droplets,
  Home,
  MapPin,
  PlugZap,
  Ruler,
  UsersRound,
} from "lucide-react";

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

function formatWaterFee(type: string) {
  return type === "INCLUDED"
    ? "Sudah termasuk"
    : "Belum termasuk";
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

function getLowestPriceItem(
  prices: {
    type: string;
    price: number;
  }[],
) {
  if (prices.length === 0) {
    return null;
  }

  return prices.reduce((lowest, current) => {
    return current.price < lowest.price
      ? current
      : lowest;
  }, prices[0]);
}

function WhatsappLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.46 14.86L2 22l5.28-1.54A9.95 9.95 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.13.91.94-3.05-.2-.31a8.04 8.04 0 1 1 6.82 3.76Zm4.43-6.03c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}
function GoogleMapsLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="9"
        r="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-red-50 bg-linear-to-br from-white to-[#FFF7F8] p-4 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-950/5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {label}
          </p>

          <p className="mt-1 wrap-break-words font-black text-zinc-950">
            {value}
          </p>
        </div>
      </div>
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

  return {
    title: `${kost.name} - Kost ${kost.region.name}`,
    description:
      kost.description ??
      `Lihat informasi ${kost.name} di wilayah ${kost.region.name}, termasuk harga, fasilitas, lokasi, dan kontak Public Relation melalui AngkasaKost.`,

    alternates: {
      canonical: `/kost/${kost.slug}`,
    },
  };
}

/**
 * ============================================================
 * DEFAULT EXPORT WAJIB ADA
 * ============================================================
 *
 * Next.js membutuhkan default export berupa React Component.
 * Jangan memindahkan kode Route Handler WhatsApp ke file ini.
 */
export default async function DetailKostPage({
  params,
}: DetailKostPageProps) {
  const { slug } = await params;

  const kost = await prisma.kost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },

    include: {
      region: {
        include: {
          /**
           * Hanya dipakai untuk mengetahui apakah minimal
           * terdapat satu Public Relation aktif.
           *
           * Pemilihan PR sebenarnya dilakukan ketika tombol
           * WhatsApp diklik melalui endpoint internal.
           */
          publicRelations: {
            where: {
              isActive: true,
            },

            select: {
              id: true,
            },

            take: 1,
          },
        },
      },

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

  const lowestPriceItem = getLowestPriceItem(
    kost.prices,
  );

  const hasActivePublicRelation =
    kost.region.publicRelations.length > 0;

  /**
   * Jangan arahkan langsung ke nomor WhatsApp tertentu.
   *
   * Endpoint ini akan memilih PR aktif secara merata,
   * menambah assignmentCount, lalu redirect ke WhatsApp.
   */
  const whatsappRedirectUrl =
    `/api/kost/${kost.slug}/whatsapp`;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-950">
      <SiteHeader />

      <main>
        {/* =========================================================
            BREADCRUMB
        ========================================================== */}
        <section className="border-b border-red-100 bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              <Link
                href="/"
                className="transition hover:text-[#BE1E2D]"
              >
                Home
              </Link>

              <span className="text-zinc-300">{">"}</span>

              <Link
                href="/kost"
                className="transition hover:text-[#BE1E2D]"
              >
                Kost
              </Link>

              <span className="text-zinc-300">{">"}</span>

              <span className="text-[#BE1E2D]">
                {kost.name}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8 lg:py-12">
          <div className="space-y-8">
            {/* =====================================================
                GALERI FOTO
            ====================================================== */}
            <KostGallery
              kostName={kost.name}
              images={kost.images}
            />

            {/* =====================================================
                INFORMASI UTAMA
            ====================================================== */}
            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
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
                  "Informasi detail kost ini tersedia melalui narahubung. Silakan hubungi Public Relation wilayah untuk informasi lebih lanjut."}
              </p>
            </section>

            {/* =====================================================
                HARGA SEWA
            ====================================================== */}
            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">
                Harga Sewa
              </h2>

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

            {/* =====================================================
                INFORMASI KOST
            ====================================================== */}
            <section className="rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-2xl font-black">
                Informasi Kost
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Detail utama yang perlu kamu ketahui sebelum
                menghubungi narahubung.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <InfoCard
                  icon={Ruler}
                  label="Ukuran Kamar"
                  value={kost.roomSize ?? "Belum tersedia"}
                />

                <InfoCard
                  icon={MapPin}
                  label="Jarak ke Kampus"
                  value={
                    kost.distanceToCampusInMeters
                      ? `${kost.distanceToCampusInMeters} meter`
                      : "Belum tersedia"
                  }
                />

                <InfoCard
                  icon={Home}
                  label="Wilayah"
                  value={kost.region.name}
                />

                <InfoCard
                  icon={Droplets}
                  label="Biaya Air"
                  value={formatWaterFee(kost.waterFeeType)}
                />

                <InfoCard
                  icon={PlugZap}
                  label="Listrik"
                  value={formatElectricity(
                    kost.electricityType,
                  )}
                />

                <InfoCard
                  icon={UsersRound}
                  label="Narahubung"
                  value={`Tim Public Relation ${kost.region.name}`}
                />
              </div>
            </section>

            {/* =====================================================
                FASILITAS
            ====================================================== */}
            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">
                Fasilitas
              </h2>

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
          </div>

          {/* =======================================================
              SIDEBAR
          ======================================================== */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-xl shadow-red-950/5">
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                Mulai dari
              </p>

              <div className="mt-2">
                <p className="text-3xl font-black text-[#BE1E2D]">
                  {lowestPriceItem
                    ? formatRupiah(lowestPriceItem.price)
                    : "-"}
                </p>

                {lowestPriceItem && (
                  <p className="mt-1 text-sm font-semibold text-zinc-500">
                    / {getPriceLabel(lowestPriceItem.type)}
                  </p>
                )}
              </div>

              {/* <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#BE1E2D]">
                  Narahubung Resmi
                </p>

                <p className="mt-2 font-black text-zinc-950">
                  Tim Public Relation {kost.region.name}
                </p>

                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Kontak dipilih otomatis agar pertanyaan pengguna
                  dibagikan secara merata.
                </p>
              </div> */}

              <div className="mt-6 grid gap-3">
                {hasActivePublicRelation ? (
                  <a
                    href={whatsappRedirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] text-sm font-black text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-[#9F1725]"
                  >
                    <WhatsappLogo />
                    Hubungi via Whatsapp
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-zinc-200 text-sm font-black text-zinc-500"
                  >
                    <WhatsappLogo />
                    Kontak Belum Tersedia
                  </button>
                )}

                {kost.googleMapsUrl && (
                  <a
                    href={kost.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-100 text-sm font-black text-[#BE1E2D] transition hover:bg-red-50"
                  >
                    <GoogleMapsLogo />
                    Buka Google Maps
                  </a>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-red-100 bg-[#BE1E2D] p-6 text-white shadow-xl shadow-red-950/10">
              <h2 className="text-xl font-black">
                Butuh bantuan?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/80">
                Hubungi narahubung untuk menanyakan ketersediaan kamar, jadwal survei, dan informasi tambahan lainnya.
              </p>
            </section>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}