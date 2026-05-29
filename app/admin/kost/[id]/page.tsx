import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  BedDouble,
  CalendarClock,
  Droplets,
  Edit,
  ExternalLink,
  Home,
  ImageIcon,
  MapPin,
  Phone,
  PlugZap,
  Ruler,
  Tag,
  UserRound,
  WalletCards,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminKostDetailPageProps = {
  params: Promise<{
    id: string;
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

  return "Tidak ditentukan";
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
  if (type === "INCLUDED") {
    return "Sudah termasuk";
  }

  return "Belum termasuk";
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

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 break-words text-sm font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default async function AdminKostDetailPage({
  params,
}: AdminKostDetailPageProps) {
  const { id } = await params;

  const kost = await prisma.kost.findUnique({
    where: {
      id,
    },
    include: {
      region: true,
      createdBy: {
        select: {
          name: true,
          email: true,
          role: true,
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

  const mainImage = kost.images[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1",
                getStatusClassName(kost.status),
              ].join(" ")}
            >
              {formatStatus(kost.status)}
            </span>

            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1",
                getGenderClassName(kost.genderType),
              ].join(" ")}
            >
              {getGenderLabel(kost.genderType)}
            </span>

            {kost.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#BE1E2D] ring-1 ring-red-100">
                <BadgeCheck className="h-3.5 w-3.5" />
                Kost Rekomendasi
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {kost.name}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Detail lengkap data kost yang tersimpan di sistem admin.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/kost"
            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition hover:bg-muted"
          >
            Kembali
          </Link>

          <Link
            href={`/admin/kost/${kost.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-medium text-white transition hover:bg-black/90"
          >
            <Edit className="h-4 w-4" />
            Edit Kost
          </Link>
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border bg-background p-3 shadow-sm">
            {mainImage ? (
              <div className="grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={mainImage.url}
                    alt={mainImage.altText ?? kost.name}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {kost.images.slice(1, 5).map((image) => (
                    <div
                      key={image.id}
                      className="relative aspect-video overflow-hidden rounded-2xl bg-muted"
                    >
                      <Image
                        src={image.url}
                        alt={image.altText ?? kost.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="300px"
                      />
                    </div>
                  ))}

                  {kost.images.length === 1 && (
                    <div className="flex aspect-video items-center justify-center rounded-2xl bg-red-50 text-sm font-bold text-[#BE1E2D]">
                      AngkasaKost
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-red-50">
                <div className="flex flex-col items-center gap-3 text-[#BE1E2D]">
                  <ImageIcon className="h-10 w-10" />
                  <p className="text-sm font-bold">Belum ada gambar</p>
                </div>
              </div>
            )}
          </div>

          {kost.images.length > 0 && (
            <div className="rounded-3xl border bg-background p-5 shadow-sm">
              <h3 className="font-bold">Galeri Gambar</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Semua foto yang terhubung dengan data kost ini.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {kost.images.map((image, index) => (
                  <a
                    key={image.id}
                    href={image.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-2xl border bg-muted"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={image.url}
                        alt={image.altText ?? `${kost.name} ${index + 1}`}
                        fill
                        unoptimized
                        className="object-cover transition group-hover:scale-105"
                        sizes="250px"
                      />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <h3 className="font-bold">Deskripsi Kost</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {kost.description ??
                "Deskripsi belum tersedia. Tambahkan deskripsi agar informasi kost lebih jelas untuk pengguna."}
            </p>
          </div>

          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <h3 className="font-bold">Fasilitas</h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {kost.facilities.map((item) => (
                <span
                  key={item.facilityId}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-[#BE1E2D] ring-1 ring-red-100"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {item.facility.name}
                </span>
              ))}

              {kost.facilities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Belum ada fasilitas yang dipilih.
                </p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border bg-background p-5 shadow-sm">
            <h3 className="font-bold">Harga Sewa</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Pilihan harga yang tersedia.
            </p>

            <div className="mt-5 grid gap-3">
              {kost.prices.map((price) => (
                <div
                  key={price.id}
                  className="rounded-2xl border bg-gradient-to-br from-white to-red-50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
                      <WalletCards className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {getPriceLabel(price.type)}
                      </p>
                      <p className="text-lg font-black text-[#BE1E2D]">
                        {formatRupiah(price.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {kost.prices.length === 0 && (
                <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                  Harga belum tersedia.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3">
            <InfoCard icon={Home} label="Wilayah" value={kost.region.name} />

            <InfoCard
              icon={Phone}
              label="WhatsApp Narahubung"
              value={kost.contactWhatsapp}
            />

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
              icon={Droplets}
              label="Biaya Air"
              value={formatWaterFee(kost.waterFeeType)}
            />

            <InfoCard
              icon={PlugZap}
              label="Listrik"
              value={formatElectricity(kost.electricityType)}
            />

            <InfoCard
              icon={UserRound}
              label="Ditambahkan Oleh"
              value={
                kost.createdBy?.name ??
                kost.createdBy?.email ??
                "Admin tidak diketahui"
              }
            />

            <InfoCard
              icon={CalendarClock}
              label="Dibuat"
              value={formatDateTime(kost.createdAt)}
            />

            <InfoCard
              icon={CalendarClock}
              label="Terakhir Diupdate"
              value={formatDateTime(kost.updatedAt)}
            />
          </div>

          {kost.googleMapsUrl && (
            <a
              href={kost.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-bold text-[#BE1E2D] transition hover:bg-red-100"
            >
              <ExternalLink className="h-4 w-4" />
              Buka Google Maps
            </a>
          )}
        </aside>
      </section>
    </div>
  );
}