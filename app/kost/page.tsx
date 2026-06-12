import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ScrollReveal from "@/components/scroll-reveal";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import KostFilterSheet from "@/features/kost/kost-filter-sheet";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daftar Kos Sekitar IPB Dramaga",
  description:
    "Jelajahi daftar kost sekitar Kampus IPB Dramaga berdasarkan wilayah, harga, fasilitas, dan jarak ke kampus melalui AngkasaKost.",
  alternates: {
    canonical: "/kost",
  },
};

/**
 * Jumlah kartu kost yang ditampilkan pada setiap halaman.
 *
 * Nilai 12 cocok untuk:
 * - Desktop: 3 kolom × 4 baris
 * - Tablet: 2 kolom × 6 baris
 * - Mobile: 2 kolom × 6 baris
 */
const ITEMS_PER_PAGE = 12;

type KostPageProps = {
  searchParams?: Promise<{
    q?: string | string[];
    regionId?: string | string[];
    genderType?: string | string[];
    facilityIds?: string | string[];
    rentType?: string | string[];
    waterFeeType?: string | string[];
    electricityType?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};

type RegionItem = {
  id: string;
  name: string;
};

type FacilityItem = {
  id: string;
  name: string;
};

type FilterFormProps = {
  regions: RegionItem[];
  facilities: FacilityItem[];
  q: string;
  regionId: string;
  genderType: string;
  rentType: string;
  waterFeeType: string;
  electricityType: string;
  sort: string;
  selectedFacilityIds: string[];
  hasActiveFilter: boolean;
  idPrefix: string;
};

function getParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getParamArray(value?: string | string[]) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [value].filter(Boolean);
}

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

/**
 * Harga utama pada card.
 *
 * Prioritas:
 * 1. Harga bulanan
 * 2. Harga enam bulan
 * 3. Harga tahunan
 * 4. Harga pertama yang tersedia
 */
function getPriorityPrice(
  prices: {
    type: string;
    price: number;
  }[],
) {
  if (prices.length === 0) {
    return null;
  }

  const monthly = prices.find((price) => price.type === "MONTHLY");
  const sixMonths = prices.find((price) => price.type === "SIX_MONTHS");
  const yearly = prices.find((price) => price.type === "YEARLY");

  return monthly ?? sixMonths ?? yearly ?? prices[0];
}

function getLowestPrice(prices: { price: number }[]) {
  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices.map((price) => price.price));
}

function formatDistance(distance: number | null) {
  if (!distance) {
    return "Jarak belum tersedia";
  }

  if (distance >= 1000) {
    const kilometer = distance / 1000;

    return `${kilometer.toLocaleString("id-ID", {
      maximumFractionDigits: 1,
    })} km dari kampus`;
  }

  return `${distance}m dari kampus`;
}

function formatWaterFee(type: string) {
  return type === "INCLUDED" ? "Termasuk" : "Belum termasuk";
}

function formatElectricity(type: string) {
  if (type === "INCLUDED") {
    return "Termasuk";
  }

  if (type === "TOKEN") {
    return "Token";
  }

  return "Terpisah";
}

/**
 * Form filter dibuat reusable agar desktop, tablet, dan mobile
 * menggunakan field yang sama.
 *
 * idPrefix digunakan agar id input desktop dan mobile tidak bentrok.
 */
function FilterForm({
  regions,
  facilities,
  q,
  regionId,
  genderType,
  rentType,
  waterFeeType,
  electricityType,
  sort,
  selectedFacilityIds,
  hasActiveFilter,
  idPrefix,
}: FilterFormProps) {
  return (
    <form action="/kost" className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        {/* <div>
          <h2 className="text-lg font-black">Filter Kos</h2>

          <p className="mt-1 text-sm leading-5 text-zinc-500">
            Sesuaikan hasil pencarian dengan kebutuhanmu.
          </p>
        </div> */}

        {hasActiveFilter && (
          <Link
            href="/kost"
            className="shrink-0 rounded-full border border-red-100 px-3 py-1 text-xs font-black text-[#BE1E2D] transition hover:bg-red-50"
          >
            Reset
          </Link>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${idPrefix}-q`}
          className="text-sm font-bold"
        >
          Search
        </label>

        <input
          id={`${idPrefix}-q`}
          name="q"
          defaultValue={q}
          placeholder="Nama kost atau wilayah..."
          className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${idPrefix}-regionId`}
          className="text-sm font-bold"
        >
          Wilayah
        </label>

        <select
          id={`${idPrefix}-regionId`}
          name="regionId"
          defaultValue={regionId}
          className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
        >
          <option value="">Semua wilayah</option>

          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${idPrefix}-genderType`}
          className="text-sm font-bold"
        >
          Tipe Penghuni
        </label>

        <select
          id={`${idPrefix}-genderType`}
          name="genderType"
          defaultValue={genderType}
          className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
        >
          <option value="">Semua tipe</option>
          <option value="PUTRA">Putra</option>
          <option value="PUTRI">Putri</option>
          <option value="CAMPUR">Campur</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${idPrefix}-rentType`}
          className="text-sm font-bold"
        >
          Jenis Sewa
        </label>

        <select
          id={`${idPrefix}-rentType`}
          name="rentType"
          defaultValue={rentType}
          className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
        >
          <option value="">Semua jenis</option>
          <option value="MONTHLY">1 Bulan</option>
          <option value="THREE_MONTHS">3 Bulan</option>
          <option value="SIX_MONTHS">6 Bulan</option>
          <option value="YEARLY">1 Tahun</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-1.5">
          <label
            htmlFor={`${idPrefix}-waterFeeType`}
            className="text-sm font-bold"
          >
            Biaya Air
          </label>

          <select
            id={`${idPrefix}-waterFeeType`}
            name="waterFeeType"
            defaultValue={waterFeeType}
            className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
          >
            <option value="">Semua</option>
            <option value="INCLUDED">Sudah termasuk</option>
            <option value="NOT_INCLUDED">Belum termasuk</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor={`${idPrefix}-electricityType`}
            className="text-sm font-bold"
          >
            Listrik
          </label>

          <select
            id={`${idPrefix}-electricityType`}
            name="electricityType"
            defaultValue={electricityType}
            className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
          >
            <option value="">Semua</option>
            <option value="INCLUDED">Sudah termasuk</option>
            <option value="TOKEN">Token</option>
            <option value="SEPARATE">Terpisah</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold">Fasilitas</p>

        <div className="grid max-h-52 gap-2 overflow-y-auto pr-1">
          {facilities.map((facility) => (
            <label
              key={facility.id}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-red-100 bg-[#FAFAFC] px-3 py-2 text-sm transition hover:bg-red-50"
            >
              <input
                type="checkbox"
                name="facilityIds"
                value={facility.id}
                defaultChecked={selectedFacilityIds.includes(facility.id)}
                className="accent-[#BE1E2D]"
              />

              <span>{facility.name}</span>
            </label>
          ))}

          {facilities.length === 0 && (
            <p className="text-sm text-zinc-500">
              Belum ada fasilitas yang tersedia.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`${idPrefix}-sort`}
          className="text-sm font-bold"
        >
          Urutkan
        </label>

        <select
          id={`${idPrefix}-sort`}
          name="sort"
          defaultValue={sort}
          className="h-11 w-full rounded-xl border border-red-100 bg-[#FAFAFC] px-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
        >
          <option value="newest">Terbaru</option>
          <option value="price_low">Harga terendah</option>
          <option value="distance_low">Jarak terdekat</option>
        </select>
      </div>

      {/*
        Container sticky membuat tombol submit tetap terlihat
        ketika isi sidebar atau drawer di-scroll.
      */}
      <div className="sticky bottom-0 -mx-1 border-t border-red-100 bg-white/95 px-1 pb-1 pt-4 backdrop-blur">
        <button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#BE1E2D] text-sm font-black text-white shadow-lg shadow-red-950/10 transition hover:bg-[#9F1725]"
        >
          Terapkan Filter
        </button>
      </div>
    </form>
  );
}

export default async function KostPage({
  searchParams,
}: KostPageProps) {
  const params = await searchParams;

  const q = getParam(params?.q).trim();
  const regionId = getParam(params?.regionId);
  const genderType = getParam(params?.genderType);
  const rentType = getParam(params?.rentType);
  const waterFeeType = getParam(params?.waterFeeType);
  const electricityType = getParam(params?.electricityType);
  const sort = getParam(params?.sort) || "newest";
  const selectedFacilityIds = getParamArray(params?.facilityIds);

  const requestedPage = Math.max(
    Number(getParam(params?.page)) || 1,
    1,
  );

  const [regions, facilities, rawKosts] = await Promise.all([
    prisma.region.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.facility.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.kost.findMany({
      where: {
        status: "PUBLISHED",

        AND: [
          q
            ? {
              OR: [
                {
                  name: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  region: {
                    name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
            : {},

          regionId
            ? {
              regionId,
            }
            : {},

          genderType
            ? {
              genderType: genderType as any,
            }
            : {},

          rentType
            ? {
              prices: {
                some: {
                  type: rentType as any,
                },
              },
            }
            : {},

          waterFeeType
            ? {
              waterFeeType: waterFeeType as any,
            }
            : {},

          electricityType
            ? {
              electricityType: electricityType as any,
            }
            : {},

          selectedFacilityIds.length > 0
            ? {
              facilities: {
                some: {
                  facilityId: {
                    in: selectedFacilityIds,
                  },
                },
              },
            }
            : {},
        ],
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
          take: 1,
        },

        facilities: {
          include: {
            facility: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  /**
   * Sorting dilakukan setelah query.
   *
   * Untuk jumlah sekitar 50–100 kost, pendekatan ini masih aman.
   * Jika jumlah data nanti sangat besar, sorting dapat dipindahkan
   * ke database dengan menambahkan kolom lowestPrice.
   */
  const kosts = [...rawKosts].sort((a, b) => {
    if (sort === "price_low") {
      const aPrice =
        getLowestPrice(a.prices) ?? Number.MAX_SAFE_INTEGER;

      const bPrice =
        getLowestPrice(b.prices) ?? Number.MAX_SAFE_INTEGER;

      return aPrice - bPrice;
    }

    if (sort === "distance_low") {
      const aDistance =
        a.distanceToCampusInMeters ?? Number.MAX_SAFE_INTEGER;

      const bDistance =
        b.distanceToCampusInMeters ?? Number.MAX_SAFE_INTEGER;

      return aDistance - bDistance;
    }

    return 0;
  });

  const totalKosts = kosts.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalKosts / ITEMS_PER_PAGE),
  );

  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedKosts = kosts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const activeRegion = regions.find(
    (region) => region.id === regionId,
  );

  const hasActiveFilter = Boolean(
    q ||
    regionId ||
    genderType ||
    rentType ||
    waterFeeType ||
    electricityType ||
    selectedFacilityIds.length > 0 ||
    sort !== "newest",
  );

  const activeFilterCount = [
    q,
    regionId,
    genderType,
    rentType,
    waterFeeType,
    electricityType,
    sort !== "newest" ? sort : "",
    ...selectedFacilityIds,
  ].filter(Boolean).length;

  /**
   * Membuat URL pagination tanpa menghapus filter aktif.
   */
  function buildPageUrl(pageNumber: number) {
    const urlParams = new URLSearchParams();

    if (q) {
      urlParams.set("q", q);
    }

    if (regionId) {
      urlParams.set("regionId", regionId);
    }

    if (genderType) {
      urlParams.set("genderType", genderType);
    }

    if (rentType) {
      urlParams.set("rentType", rentType);
    }

    if (waterFeeType) {
      urlParams.set("waterFeeType", waterFeeType);
    }

    if (electricityType) {
      urlParams.set("electricityType", electricityType);
    }

    if (sort !== "newest") {
      urlParams.set("sort", sort);
    }

    selectedFacilityIds.forEach((facilityId) => {
      urlParams.append("facilityIds", facilityId);
    });

    urlParams.set("page", String(pageNumber));

    return `/kost?${urlParams.toString()}`;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-950">
      <SiteHeader />

      <main>
        <ScrollReveal>
          <section className="border-b border-red-100 bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF]">
            <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8 lg:py-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#BE1E2D] sm:text-xs">
                    Katalog Kos
                  </p>

                  <h1 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                    Daftar Kos Sekitar IPB
                  </h1>

                  <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500 sm:text-sm lg:text-base lg:leading-7">
                    Temukan kos berdasarkan wilayah, tipe penghuni,
                    fasilitas, dan kebutuhan sewa.
                  </p>
                </div>

                <div className="hidden rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm lg:block">
                  <p className="text-[11px] font-semibold text-zinc-500">
                    Total hasil
                  </p>

                  <p className="text-xl font-black text-[#BE1E2D]">
                    {totalKosts} Kos
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <section className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8 lg:py-8">
          {/*
            Toolbar hanya muncul pada tablet dan mobile.
            sticky top-16 menempatkannya tepat di bawah navbar h-16.
          */}
          <div className="sticky top-16 z-30 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-red-100 bg-white/95 p-3 shadow-sm backdrop-blur lg:hidden">
            <div>
              <p className="text-[11px] font-semibold text-zinc-500">
                Total hasil
              </p>

              <p className="text-sm font-black text-[#BE1E2D]">
                {totalKosts} kos ditemukan
              </p>
            </div>

            <KostFilterSheet activeFilterCount={activeFilterCount}>
              <FilterForm
                regions={regions}
                facilities={facilities}
                q={q}
                regionId={regionId}
                genderType={genderType}
                rentType={rentType}
                waterFeeType={waterFeeType}
                electricityType={electricityType}
                sort={sort}
                selectedFacilityIds={selectedFacilityIds}
                hasActiveFilter={hasActiveFilter}
                idPrefix="mobile"
              />
            </KostFilterSheet>
          </div>

          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/*
              Sidebar hanya muncul pada desktop.
              Sidebar memiliki area scroll sendiri jika filter terlalu panjang.
            */}
            <aside className="hidden h-fit rounded-3xl border border-red-100 bg-white p-5 shadow-sm lg:sticky lg:top-20 lg:block lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <FilterForm
                regions={regions}
                facilities={facilities}
                q={q}
                regionId={regionId}
                genderType={genderType}
                rentType={rentType}
                waterFeeType={waterFeeType}
                electricityType={electricityType}
                sort={sort}
                selectedFacilityIds={selectedFacilityIds}
                hasActiveFilter={hasActiveFilter}
                idPrefix="desktop"
              />
            </aside>

            <div className="space-y-5">
              {hasActiveFilter && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-red-100 bg-white p-3 shadow-sm">
                  <p className="mr-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400">
                    Filter aktif
                  </p>

                  {q && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      Search: {q}
                    </span>
                  )}

                  {activeRegion && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      Wilayah: {activeRegion.name}
                    </span>
                  )}

                  {genderType && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      Tipe: {getGenderLabel(genderType)}
                    </span>
                  )}

                  {rentType && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      Sewa: {getPriceLabel(rentType)}
                    </span>
                  )}

                  {waterFeeType && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      Air: {formatWaterFee(waterFeeType)}
                    </span>
                  )}

                  {electricityType && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      Listrik: {formatElectricity(electricityType)}
                    </span>
                  )}

                  {selectedFacilityIds.length > 0 && (
                    <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold text-[#BE1E2D] sm:text-xs">
                      {selectedFacilityIds.length} fasilitas dipilih
                    </span>
                  )}

                  <Link
                    href="/kost"
                    className="ml-auto rounded-full border border-red-100 px-3 py-1 text-[11px] font-black text-[#BE1E2D] transition hover:bg-red-50 sm:text-xs"
                  >
                    Reset
                  </Link>
                </div>
              )}

              {paginatedKosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                    {paginatedKosts.map((kost) => {
                      const mainImage = kost.images[0];

                      const priorityPrice = getPriorityPrice(
                        kost.prices,
                      );

                      return (
                        <Link
                          key={kost.id}
                          href={`/kost/${kost.slug}`}
                          className="group overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/10 lg:rounded-3xl"
                        >
                          <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-red-50 to-zinc-100">
                            {mainImage ? (
                              <Image
                                src={mainImage.url}
                                alt={mainImage.altText ?? kost.name}
                                unoptimized
                                fill
                                className="object-cover transition duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <div className="rounded-xl bg-white/80 px-3 py-2 text-[10px] font-black text-[#BE1E2D] lg:text-sm">
                                  AngkasaKost
                                </div>
                              </div>
                            )}

                            <div className="absolute left-2 top-2 flex flex-wrap gap-1.5 sm:left-3 sm:top-3">
                              <span className="max-w-22.5 truncate rounded-full bg-white/90 px-2 py-1 text-[9px] font-black text-[#BE1E2D] backdrop-blur sm:max-w-none sm:text-xs">
                                {kost.region.name}
                              </span>

                              <span
                                className={[
                                  "rounded-full px-2 py-1 text-[9px] font-black ring-1 backdrop-blur sm:text-xs",
                                  getGenderClassName(kost.genderType),
                                ].join(" ")}
                              >
                                {getGenderLabel(kost.genderType)}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 p-3 sm:space-y-3 sm:p-4 lg:p-5">
                            <div>
                              <h3 className="line-clamp-2 text-sm font-black leading-snug sm:text-base lg:text-lg">
                                {kost.name}
                              </h3>

                              {kost.isFeatured && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#BE1E2D] ring-1 ring-red-100">
                                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#BE1E2D] text-[8px] text-white">
                                      ✓
                                    </span>

                                    Kos Rekomendasi
                                  </span>
                                </div>
                              )}

                              <p className="mt-1 text-[10px] text-zinc-500 sm:text-xs lg:text-sm">
                                {formatDistance(
                                  kost.distanceToCampusInMeters,
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 sm:text-[10px] lg:text-xs">
                                Harga
                              </p>

                              <p className="text-sm font-black leading-tight text-[#BE1E2D] sm:text-lg lg:text-xl">
                                {priorityPrice
                                  ? formatRupiah(priorityPrice.price)
                                  : "-"}
                              </p>

                              {priorityPrice && (
                                <p className="text-[10px] font-semibold text-zinc-500 sm:text-xs">
                                  / {getPriceLabel(priorityPrice.type)}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {kost.facilities
                                .slice(0, 3)
                                .map((item) => (
                                  <span
                                    key={item.facilityId}
                                    className="rounded-full bg-[#F4F6FF] px-2 py-1 text-[9px] font-semibold text-zinc-700 sm:text-xs"
                                  >
                                    {item.facility.name}
                                  </span>
                                ))}

                              {kost.facilities.length > 3 && (
                                <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-black text-[#BE1E2D] sm:text-xs">
                                  +{kost.facilities.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <nav
                      aria-label="Navigasi halaman daftar kost"
                      className="flex flex-wrap items-center justify-center gap-2 pt-3"
                    >
                      <Link
                        href={buildPageUrl(
                          Math.max(currentPage - 1, 1),
                        )}
                        aria-disabled={currentPage === 1}
                        className={[
                          "inline-flex h-10 items-center justify-center rounded-xl border px-3 text-xs font-bold transition sm:px-4 sm:text-sm",
                          currentPage === 1
                            ? "pointer-events-none border-zinc-100 bg-zinc-50 text-zinc-300"
                            : "border-red-100 bg-white text-[#BE1E2D] hover:bg-red-50",
                        ].join(" ")}
                      >
                        Sebelumnya
                      </Link>

                      {Array.from(
                        {
                          length: totalPages,
                        },
                        (_, index) => index + 1,
                      ).map((pageNumber) => (
                        <Link
                          key={pageNumber}
                          href={buildPageUrl(pageNumber)}
                          aria-current={
                            currentPage === pageNumber
                              ? "page"
                              : undefined
                          }
                          className={[
                            "inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition",
                            currentPage === pageNumber
                              ? "bg-[#BE1E2D] text-white shadow-sm"
                              : "border border-red-100 bg-white text-[#BE1E2D] hover:bg-red-50",
                          ].join(" ")}
                        >
                          {pageNumber}
                        </Link>
                      ))}

                      <Link
                        href={buildPageUrl(
                          Math.min(currentPage + 1, totalPages),
                        )}
                        aria-disabled={currentPage === totalPages}
                        className={[
                          "inline-flex h-10 items-center justify-center rounded-xl border px-3 text-xs font-bold transition sm:px-4 sm:text-sm",
                          currentPage === totalPages
                            ? "pointer-events-none border-zinc-100 bg-zinc-50 text-zinc-300"
                            : "border-red-100 bg-white text-[#BE1E2D] hover:bg-red-50",
                        ].join(" ")}
                      >
                        Berikutnya
                      </Link>
                    </nav>
                  )}
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-red-200 bg-white px-6 py-16 text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                    ⌕
                  </div>

                  <h3 className="text-2xl font-black">
                    Kos tidak ditemukan
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                    Coba ubah kata pencarian atau kurangi filter untuk
                    melihat lebih banyak pilihan kost.
                  </p>

                  <Link
                    href="/kost"
                    className="mt-6 inline-flex rounded-xl bg-[#BE1E2D] px-6 py-3 text-sm font-black text-white"
                  >
                    Reset Filter
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}