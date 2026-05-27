import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  CheckCircle2,
  Clock3,
  DraftingCompass,
  Home,
  ImageIcon,
  MapPin,
  Plus,
  Sparkles,
  Tags,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

function getLowestPrice(
  prices: {
    type: string;
    price: number;
  }[]
) {
  if (prices.length === 0) {
    return null;
  }

  return prices.reduce((lowest, current) => {
    if (current.price < lowest.price) {
      return current;
    }

    return lowest;
  }, prices[0]);
}

function formatStatus(status: string) {
  if (status === "PUBLISHED") {
    return "Published";
  }

  if (status === "ARCHIVED") {
    return "Archived";
  }

  return "Draft";
}

function getStatusClassName(status: string) {
  if (status === "PUBLISHED") {
    return "bg-green-50 text-green-700 ring-green-100";
  }

  if (status === "ARCHIVED") {
    return "bg-zinc-100 text-zinc-700 ring-zinc-200";
  }

  return "bg-yellow-50 text-yellow-700 ring-yellow-100";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ElementType;
  tone?: "default" | "red" | "green" | "yellow" | "blue" | "zinc";
}) {
  const toneClassName = {
    default: "bg-zinc-950 text-white",
    red: "bg-red-50 text-[#BE1E2D] ring-red-100",
    green: "bg-green-50 text-green-700 ring-green-100",
    yellow: "bg-yellow-50 text-yellow-700 ring-yellow-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    zinc: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  }[tone];

  return (
    <div className="group rounded-2xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-zinc-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
        </div>

        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1",
            toneClassName,
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [
    kostCount,
    publishedKostCount,
    draftKostCount,
    archivedKostCount,
    featuredKostCount,
    regionCount,
    facilityCount,
    imageCount,
    recentKosts,
    topRegions,
  ] = await Promise.all([
    prisma.kost.count(),

    prisma.kost.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.kost.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.kost.count({
      where: {
        status: "ARCHIVED",
      },
    }),

    prisma.kost.count({
      where: {
        isFeatured: true,
      },
    }),

    prisma.region.count(),

    prisma.facility.count(),

    prisma.kostImage.count(),

    prisma.kost.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.region.findMany({
      include: {
        _count: {
          select: {
            kosts: true,
          },
        },
      },
      orderBy: {
        kosts: {
          _count: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const publicationRate =
    kostCount > 0 ? Math.round((publishedKostCount / kostCount) * 100) : 0;

  const draftRate =
    kostCount > 0 ? Math.round((draftKostCount / kostCount) * 100) : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-zinc-950 via-zinc-900 to-[#4A0D16] p-6 text-white shadow-xl shadow-zinc-950/10 sm:p-8">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#BE1E2D]/30 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
              <Sparkles className="h-4 w-4 text-red-200" />
              Admin Overview
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Dashboard AngkasaKost
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
              Pantau ringkasan data kost, status publikasi, wilayah, fasilitas,
              dan aktivitas terbaru dalam satu halaman.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/kost/create"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-black text-zinc-950 shadow-lg shadow-black/10 transition hover:bg-red-50"
            >
              <Plus className="h-4 w-4" />
              Tambah Kost
            </Link>

            <Link
              href="/admin/kost"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
            >
              Kelola Data
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="relative mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Publication Rate
            </p>
            <p className="mt-2 text-3xl font-black">{publicationRate}%</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${publicationRate}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Draft Rate
            </p>
            <p className="mt-2 text-3xl font-black">{draftRate}%</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-red-200"
                style={{
                  width: `${draftRate}%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Kost Rekomendasi
            </p>
            <p className="mt-2 text-3xl font-black">{featuredKostCount}</p>
            <p className="mt-3 text-xs leading-5 text-white/60">
              Kost yang tampil sebagai rekomendasi pada halaman utama.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Kost"
          value={kostCount}
          description="Seluruh data kost yang tersimpan di sistem."
          icon={Home}
          tone="red"
        />

        <StatCard
          title="Published"
          value={publishedKostCount}
          description="Data kost yang sudah tampil di halaman publik."
          icon={CheckCircle2}
          tone="green"
        />

        <StatCard
          title="Draft"
          value={draftKostCount}
          description="Data kost yang masih perlu dilengkapi atau dicek."
          icon={DraftingCompass}
          tone="yellow"
        />

        <StatCard
          title="Archived"
          value={archivedKostCount}
          description="Data kost yang sedang tidak ditampilkan."
          icon={Clock3}
          tone="zinc"
        />

        <StatCard
          title="Wilayah"
          value={regionCount}
          description="Kategori wilayah yang dapat dipilih pengguna."
          icon={MapPin}
          tone="blue"
        />

        <StatCard
          title="Fasilitas"
          value={facilityCount}
          description="Master data fasilitas untuk setiap kost."
          icon={Tags}
          tone="red"
        />

        <StatCard
          title="Foto Kost"
          value={imageCount}
          description="Total gambar yang sudah diunggah ke sistem."
          icon={ImageIcon}
          tone="blue"
        />

        <StatCard
          title="Rekomendasi"
          value={featuredKostCount}
          description="Kost yang diberi label rekomendasi."
          icon={BadgeCheck}
          tone="green"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b p-5">
            <div>
              <h2 className="font-bold">Kost Terbaru</h2>
              <p className="text-xs text-muted-foreground">
                Data kost terakhir yang ditambahkan atau diperbarui.
              </p>
            </div>

            <Link
              href="/admin/kost"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#BE1E2D] hover:underline"
            >
              Lihat semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y">
            {recentKosts.map((kost) => {
              const image = kost.images[0];
              const price = getLowestPrice(kost.prices);

              return (
                <Link
                  key={kost.id}
                  href={`/admin/kost/${kost.id}/edit`}
                  className="flex items-center gap-4 p-4 transition hover:bg-muted/40"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-red-50 text-[#BE1E2D]">
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.altText ?? kost.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BedDouble className="h-6 w-6" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-bold">
                        {kost.name}
                      </h3>

                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
                          getStatusClassName(kost.status),
                        ].join(" ")}
                      >
                        {formatStatus(kost.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {kost.region.name} •{" "}
                      {price
                        ? `${formatRupiah(price.price)} / ${getPriceLabel(
                          price.type
                        )}`
                        : "Harga belum tersedia"}
                    </p>
                  </div>

                  <div className="hidden text-right text-xs text-muted-foreground sm:block">
                    {formatDate(kost.createdAt)}
                  </div>
                </Link>
              );
            })}

            {recentKosts.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Belum ada data kost.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border bg-background p-5 shadow-sm">
            <div>
              <h2 className="font-bold">Distribusi Wilayah</h2>
              <p className="text-xs text-muted-foreground">
                Wilayah dengan jumlah data kost terbanyak.
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {topRegions.map((region) => {
                const percentage =
                  kostCount > 0
                    ? Math.round((region._count.kosts / kostCount) * 100)
                    : 0;

                return (
                  <div key={region.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {region.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {region._count.kosts} kost
                        </p>
                      </div>

                      <span className="text-xs font-bold text-[#BE1E2D]">
                        {percentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#BE1E2D]"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {topRegions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada wilayah.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border bg-linear-to-br from-red-50 via-white to-white p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#BE1E2D] text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold">Saran Pengelolaan</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Pastikan data kost yang published memiliki foto, harga, dan
                  narahubung aktif agar informasi lebih terpercaya bagi
                  pengguna.
                </p>

                <Link
                  href="/admin/kost"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#BE1E2D] hover:underline"
                >
                  Cek data kost
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}