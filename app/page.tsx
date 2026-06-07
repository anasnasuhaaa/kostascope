import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  Database,
  FileText,
  Filter,
  MapPin,
  MessageCircle,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  WalletCards,
  Wifi,
  Wind,
  Navigation,
} from "lucide-react";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import ScrollReveal from "@/components/scroll-reveal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const SITE_URL = "https://angkasakost.ormawaeksekutifpku.com";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AngkasaKost",
  alternateName: "Angkasa Kost",
  url: SITE_URL,
};

const needs = [
  "Dekat kampus",
  "Harga bulanan dan tahunan",
  "Fasilitas lengkap",
  "Kost putra / putri",
  "AC",
  "Wifi",
];

const benefits = [
  {
    title: "Data Terstruktur",
    description:
      "Informasi kost disusun rapi mulai dari wilayah, harga, fasilitas, hingga kontak narahubung.",
    icon: Database,
  },
  {
    title: "Filter Cerdas",
    description:
      "Cari kost berdasarkan wilayah, tipe penghuni, fasilitas, dan kebutuhan sewa.",
    icon: Filter,
  },
  {
    title: "Info Harga",
    description:
      "Transparansi harga bulanan, enam bulanan, dan tahunan dalam satu tempat.",
    icon: WalletCards,
  },
  {
    title: "Kontak Langsung",
    description:
      "Hubungi narahubung kost secara langsung untuk proses pengecekan lebih lanjut.",
    icon: PhoneCall,
  },
];

const steps = [
  {
    title: "Cari",
    description: "Gunakan pencarian untuk menemukan wilayah atau nama kost.",
    icon: Search,
  },
  {
    title: "Filter",
    description: "Saring hasil berdasarkan kebutuhan dan preferensi.",
    icon: Filter,
  },
  {
    title: "Detail",
    description: "Pelajari harga, fasilitas, lokasi, dan informasi penting.",
    icon: FileText,
  },
  {
    title: "Hubungi",
    description: "Klik WhatsApp untuk menghubungi narahubung kost.",
    icon: MessageCircle,
  },
];

function getNeedIcon(need: string) {
  if (need === "Dekat kampus") {
    return MapPin;
  }

  if (need === "Harga bulanan dan tahunan") {
    return WalletCards;
  }

  if (need === "Fasilitas lengkap") {
    return Sparkles;
  }

  if (need === "Kost putra / putri") {
    return ShieldCheck;
  }

  if (need === "AC") {
    return Wind;
  }

  return Wifi;
}

function HouseVector() {
  return (
    <div className="relative mx-auto w-full max-w-130">
      <div className="absolute -left-4 top-8 h-28 w-28 rounded-full bg-[#BE1E2D]/15 blur-2xl sm:-left-8 sm:h-40 sm:w-40" />
      <div className="absolute -right-3 bottom-10 h-28 w-28 rounded-full bg-[#BE1E2D]/10 blur-2xl sm:-right-8 sm:h-44 sm:w-44" />

      <div className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-white p-4 shadow-2xl shadow-red-950/10 transition duration-500 hover:-translate-y-1 hover:shadow-red-950/15 sm:p-6">
        <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-[10px] font-bold text-[#BE1E2D] shadow-sm ring-1 ring-red-100 sm:right-6 sm:top-6 sm:px-4 sm:text-xs">
          <BadgeCheck className="h-3.5 w-3.5" />
          Kost verified
        </div>

        <svg
          viewBox="0 0 680 560"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
          aria-hidden="true"
        >
          <rect
            x="40"
            y="378"
            width="600"
            height="74"
            rx="37"
            fill="#FDECEF"
          />
          <rect
            x="86"
            y="116"
            width="508"
            height="334"
            rx="34"
            fill="#FFF7F8"
            stroke="#F4B7BE"
            strokeWidth="3"
          />
          <path
            d="M91 221L332 62C337.5 58.3 344.5 58.3 350 62L590 221"
            stroke="#BE1E2D"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M138 222L340 88L542 222V438H138V222Z"
            fill="#FFFFFF"
            stroke="#F3C4CA"
            strokeWidth="3"
          />
          <path d="M340 88L542 222H138L340 88Z" fill="#BE1E2D" />
          <path
            d="M188 260C188 247.85 197.85 238 210 238H286C298.15 238 308 247.85 308 260V338H188V260Z"
            fill="#FDECEF"
            stroke="#BE1E2D"
            strokeWidth="4"
          />
          <path
            d="M373 260C373 247.85 382.85 238 395 238H471C483.15 238 493 247.85 493 260V338H373V260Z"
            fill="#FDECEF"
            stroke="#BE1E2D"
            strokeWidth="4"
          />
          <path d="M248 238V338" stroke="#BE1E2D" strokeWidth="4" />
          <path d="M433 238V338" stroke="#BE1E2D" strokeWidth="4" />
          <path d="M188 299H308" stroke="#BE1E2D" strokeWidth="4" />
          <path d="M373 299H493" stroke="#BE1E2D" strokeWidth="4" />

          <path
            d="M286 438V346C286 334.954 294.954 326 306 326H374C385.046 326 394 334.954 394 346V438H286Z"
            fill="#BE1E2D"
          />
          <circle cx="370" cy="386" r="7" fill="white" />

          <rect
            x="150"
            y="418"
            width="380"
            height="32"
            rx="16"
            fill="#8F1622"
          />

          <circle cx="96" cy="98" r="18" fill="#FDECEF" />
          <circle cx="592" cy="112" r="24" fill="#FDECEF" />
          <circle cx="560" cy="416" r="16" fill="#BE1E2D" opacity="0.18" />
          <circle cx="110" cy="410" r="12" fill="#BE1E2D" opacity="0.18" />

          <rect
            x="66"
            y="326"
            width="126"
            height="76"
            rx="18"
            fill="white"
            stroke="#F4B7BE"
            strokeWidth="2"
          />
          <text
            x="92"
            y="357"
            fill="#BE1E2D"
            fontSize="18"
            fontWeight="800"
          >
            5+
          </text>
          <text x="92" y="380" fill="#71717A" fontSize="14">
            Wilayah
          </text>

          <rect
            x="474"
            y="70"
            width="142"
            height="78"
            rx="18"
            fill="white"
            stroke="#F4B7BE"
            strokeWidth="2"
          />
          <text
            x="500"
            y="103"
            fill="#BE1E2D"
            fontSize="18"
            fontWeight="800"
          >
            24/7
          </text>
          <text x="500" y="126" fill="#71717A" fontSize="14">
            Akses info
          </text>
        </svg>
      </div>

      <div className="absolute -bottom-6 left-4 max-w-[80%] rounded-2xl border border-red-100 bg-white p-4 shadow-xl shadow-red-950/10 block">
        <p className="text-xs font-semibold text-zinc-500">Dikelola Oleh</p>
        <p className="text-md font-black text-[#BE1E2D]">
          Biro Riset dan Teknologi, Ormawa Eksekutif PKU IPB
        </p>
      </div>
    </div>
  );
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

function getPriorityPrice(
  prices: {
    type: string;
    price: number;
  }[]
) {
  if (prices.length === 0) {
    return null;
  }

  const monthly = prices.find((price) => price.type === "MONTHLY");
  const threeMonths = prices.find((price) => price.type === "THREE_MONTHS");
  const sixMonths = prices.find((price) => price.type === "SIX_MONTHS");
  const yearly = prices.find((price) => price.type === "YEARLY");

  return monthly ?? threeMonths ?? sixMonths ?? yearly ?? prices[0];
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

function getFeaturedGridClassName(count: number) {
  if (count === 1) {
    return "grid grid-cols-1 gap-4 sm:max-w-sm";
  }

  if (count === 2) {
    return "grid grid-cols-2 gap-4 sm:max-w-2xl";
  }

  if (count === 3) {
    return "grid grid-cols-2 gap-4 md:grid-cols-3";
  }

  if (count === 4) {
    return "grid grid-cols-2 gap-4 md:grid-cols-4";
  }

  return "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5";
}

export default async function HomePage() {
  const [regions, featuredKosts] = await Promise.all([
    prisma.region.findMany({
      include: {
        _count: {
          select: {
            kosts: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.kost.findMany({
      where: {
        status: "PUBLISHED",
        isFeatured: true,
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
      take: 5,
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-950">
      <SiteHeader />

      <main>
        <ScrollReveal>
          <section className="relative overflow-hidden bg-linear-to-br from-white via-[#FFF7F8] to-[#F7F8FF]">
            <div className="absolute -left-32 top-28 h-72 w-72 rounded-full bg-[#BE1E2D]/10 blur-3xl" />
            <div className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-[#BE1E2D]/10 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
              <div className="text-center lg:text-left">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-[#BE1E2D] ring-1 ring-red-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Selamat Datang Mahasiswa Baru IPB Angkatan 63!
                </div>

                <h1 className="mx-auto max-w-2xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:mx-0 lg:text-6xl">
                  Temukan Kost Ideal di{" "}
                  <span className="text-[#BE1E2D]">Sekitar IPB Dramaga</span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600 lg:mx-0">
                  Akses informasi kost yang lebih mudah, rapi, dan relevan dengan
                  kebutuhan kamu di IPB.
                </p>

                <form
                  action="/kost"
                  className="mx-auto hidden md:grid mt-8 max-w-2xl gap-3 rounded-2xl border border-red-100 bg-white/95 p-3 shadow-2xl shadow-red-950/10 backdrop-blur sm:grid-cols-[1.4fr_1fr_auto] lg:mx-0"
                >
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BE1E2D]" />

                    <input
                      name="q"
                      placeholder="Cari wilayah atau nama kost..."
                      className="h-12 w-full rounded-xl border border-transparent bg-[#FAFAFC] pl-10 pr-4 text-sm outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
                    />
                  </div>

                  <div className="relative">
                    <select
                      name="rentType"
                      className="h-12 w-full appearance-none rounded-xl border border-transparent bg-[#FAFAFC] px-4 pr-10 text-sm font-medium text-zinc-700 outline-none transition focus:border-[#BE1E2D] focus:bg-white focus:ring-4 focus:ring-red-100"
                      defaultValue=""
                    >
                      <option value="">Jenis Sewa</option>
                      <option value="MONTHLY">1 Bulan</option>
                      <option value="THREE_MONTHS">3 Bulan</option>
                      <option value="SIX_MONTHS">6 Bulan</option>
                      <option value="YEARLY">1 Tahun</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#BE1E2D]" />
                  </div>

                  <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] px-8 text-sm font-bold text-white shadow-lg shadow-red-950/15 transition hover:-translate-y-0.5 hover:bg-[#9f1725] hover:shadow-xl">
                    <Search className="h-4 w-4" />
                    Cari
                  </button>
                </form>
              </div>

              <div className="lg:pl-8">
                <HouseVector />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {featuredKosts.length > 0 && (
          <ScrollReveal>
            <section className="relative overflow-hidden bg-white py-16 sm:py-20">
              <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#BE1E2D]/5 blur-3xl" />
              <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

              <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-[#BE1E2D] ring-1 ring-red-100 sm:mb-4 sm:gap-3 sm:rounded-full sm:px-4">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BE1E2D] text-white shadow-sm">
                        <BadgeCheck className="h-4 w-4" />
                      </span>

                      <h2 className="text-lg font-black tracking-tight text-[#BE1E2D] sm:text-3xl lg:text-4xl">
                        Kost Rekomendasi Kami
                      </h2>
                    </div>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                      Pilihan Kost terbaik untuk kamu yang menginginkan
                      kenyamanan, keamanan, dan akses mudah ke kampus IPB Dramaga.
                    </p>
                  </div>
                </div>

                <div
                  className={getFeaturedGridClassName(
                    featuredKosts.slice(0, 5).length
                  )}
                >
                  {featuredKosts.slice(0, 5).map((kost) => {
                    const image = kost.images[0];
                    const price = getPriorityPrice(kost.prices);

                    return (
                      <Link
                        key={kost.id}
                        href={`/kost/${kost.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-red-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/10"
                      >
                        <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-red-50 to-zinc-100">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText ?? kost.name}
                              unoptimized
                              fill
                              className="object-cover transition duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="rounded-xl bg-white px-4 py-2 text-xs font-black text-[#BE1E2D] shadow-sm">
                                Angkasa Kost
                              </span>
                            </div>
                          )}

                          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#BE1E2D] shadow-sm backdrop-blur">
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Rekomendasi
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-3 flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-[#BE1E2D]">
                              <MapPin className="h-3 w-3" />
                              {kost.region.name}
                            </span>

                            <span
                              className={[
                                "rounded-full px-3 py-1 text-[10px] font-black ring-1",
                                getGenderClassName(kost.genderType),
                              ].join(" ")}
                            >
                              {getGenderLabel(kost.genderType)}
                            </span>
                          </div>

                          <h3 className="line-clamp-2 min-h-12 text-base font-black leading-snug text-zinc-950">
                            {kost.name}
                          </h3>

                          <p className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500">
                            <MapPin className="h-3.5 w-3.5 text-[#BE1E2D]" />
                            {formatDistance(kost.distanceToCampusInMeters)}
                          </p>

                          <div className="mt-4 rounded-2xl bg-[#FFF7F8] p-3 ring-1 ring-red-100">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              Mulai dari
                            </p>

                            <p className="mt-1 text-lg font-black text-[#BE1E2D]">
                              {price ? formatRupiah(price.price) : "-"}
                            </p>

                            {price && (
                              <p className="text-xs font-semibold text-zinc-500">
                                / {getPriceLabel(price.type)}
                              </p>
                            )}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {kost.facilities.slice(0, 3).map((item) => (
                              <span
                                key={item.facilityId}
                                className="rounded-full bg-[#F4F6FF] px-2.5 py-1 text-[10px] font-semibold text-zinc-700"
                              >
                                {item.facility.name}
                              </span>
                            ))}

                            {kost.facilities.length > 3 && (
                              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-black text-[#BE1E2D]">
                                +{kost.facilities.length - 3}
                              </span>
                            )}
                          </div>

                          <div className="mt-auto pt-5">
                            <div className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] text-xs font-black text-white transition group-hover:bg-[#9f1725]">
                              Lihat Detail
                              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}
        <ScrollReveal>
          <section className="relative overflow-hidden bg-white py-16 sm:py-20">
            <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-[#BE1E2D]/5 blur-3xl" />
            <div className="absolute -right-24 bottom-16 h-64 w-64 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5 sm:p-6"
                    >
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                      <div className="relative">
                        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100 transition duration-300 group-hover:bg-[#BE1E2D] group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>

                        <h3 className="text-lg font-black tracking-tight text-zinc-950">
                          {benefit.title}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-[#BE1E2D] ring-1 ring-red-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  Keunggulan Kami
                </div>

                <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                  Mendefinisikan Ulang Pengalaman Mencari Kost Mahasiswa
                </h2>

                <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600">
                  Kami memahami bahwa tempat tinggal adalah pondasi kenyamanan
                  belajar. AngkasaKost hadir untuk menjawab kebingungan Maba!
                </p>

                <div className="mt-7 grid gap-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-[#FFF7F8] px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BE1E2D] text-white">
                      <CircleCheck className="h-4 w-4" />
                    </span>

                    <p className="text-sm font-semibold text-zinc-700">
                      Verifikasi lokasi & fasilitas fisik
                    </p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-[#FFF7F8] px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#BE1E2D] text-white">
                      <CircleCheck className="h-4 w-4" />
                    </span>

                    <p className="text-sm font-semibold text-zinc-700">
                      Update data secara berkala untuk memastikan informasi tetap akurat dan relevan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="relative overflow-hidden bg-[#F4F6FF] py-14 sm:py-16">
            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#BE1E2D] shadow-sm ring-1 ring-red-100">
                <Target className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight">
                Cari Berdasarkan Kebutuhan
              </h2>

              <p className="mt-3 text-sm text-zinc-600">
                Pilih kategori yang paling sesuai dengan prioritas harian Kamu.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {needs.map((need) => {
                  const Icon = getNeedIcon(need);

                  return (
                    <Link
                      key={need}
                      href="/kost"
                      className="group inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#BE1E2D] hover:text-[#BE1E2D] hover:shadow-md sm:px-5"
                    >
                      <Icon className="h-4 w-4 text-[#BE1E2D]" />
                      {need}
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section
            id="wilayah"
            className="relative overflow-hidden bg-white py-16 sm:py-20"
          >
            <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#BE1E2D]/5 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-[#BE1E2D] ring-1 ring-red-100 sm:mb-4 sm:gap-3 sm:rounded-full sm:px-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#BE1E2D] text-white shadow-sm">
                      <MapPin className="h-4 w-4" />
                    </span>

                    <h2 className="text-lg font-black tracking-tight text-[#BE1E2D] sm:text-3xl lg:text-4xl">
                      Wilayah Sekitar IPB Dramaga
                    </h2>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                    Tentukan wilayah yang paling sesuai dengan aktivitas dan kebutuhan Kamu.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-red-100 bg-[#FFF7F8] px-4 py-3 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#BE1E2D] text-white shadow-lg shadow-red-950/10">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Total Tersedia
                    </p>

                    <p className="text-lg font-black text-[#BE1E2D]">
                      {regions.reduce(
                        (total, region) => total + region._count.kosts,
                        0
                      )}{" "}
                      Kost
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {regions.map((region, index) => (
                  <Link
                    key={region.id}
                    href={`/kost?regionId=${region.id}`}
                    className="group relative isolate overflow-hidden rounded-3xl border border-red-100 bg-linear-to-br from-white via-[#FFF9FA] to-[#F7F8FF] p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/10 sm:p-5"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#BE1E2D] transition duration-300 group-hover:scale-x-100" />

                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border-14 border-red-50 transition duration-500 group-hover:scale-110 group-hover:border-red-100 sm:h-32 sm:w-32" />

                    <div className="absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-[#BE1E2D]/10 blur-2xl transition duration-500 group-hover:scale-125" />

                    <div className="absolute bottom-3 right-2 opacity-[0.06] transition duration-500 group-hover:scale-110 group-hover:opacity-[0.12]">
                      <Building2 className="h-20 w-20 text-[#BE1E2D] sm:h-28 sm:w-28" />
                    </div>

                    <div className="relative flex min-h-44 flex-col sm:min-h-56">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#BE1E2D] text-white shadow-lg shadow-red-950/15 transition duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 sm:h-12 sm:w-12">
                          <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>

                        <span className="text-3xl font-black leading-none text-red-100 transition duration-300 group-hover:text-red-200 sm:text-4xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-auto pt-8">
                        <h3 className="line-clamp-2 text-lg font-black tracking-tight text-zinc-950 sm:text-2xl">
                          {region.name}
                        </h3>

                        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white/85 px-2.5 py-2 shadow-sm backdrop-blur sm:px-3">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-[#BE1E2D]" />

                          <p className="text-[11px] font-bold text-zinc-700 sm:text-sm">
                            <span className="font-black text-[#BE1E2D]">
                              {region._count.kosts}
                            </span>{" "}
                            kost tersedia
                          </p>
                        </div>

                        <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-black text-[#BE1E2D] sm:text-xs">
                          Lihat Kost
                          <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {regions.length === 0 && (
                  <div className="col-span-2 rounded-3xl border border-dashed border-red-200 bg-[#FFF7F8] px-6 py-12 text-center lg:col-span-3 xl:col-span-4">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#BE1E2D] shadow-sm ring-1 ring-red-100">
                      <BedDouble className="h-5 w-5" />
                    </div>

                    <p className="mt-4 text-sm font-bold text-zinc-700">
                      Belum ada wilayah yang tersedia.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="relative overflow-hidden bg-[#F4F6FF] py-16 sm:py-20">
            <div className="absolute -left-28 top-20 h-64 w-64 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#BE1E2D] shadow-sm ring-1 ring-red-100">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight">
                Bagaimana Cara Kerjanya?
              </h2>

              <p className="mt-3 text-sm text-zinc-600">
                Langkah sederhana untuk mendapatkan hunian impian.
              </p>

              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/5"
                    >
                      <div className="absolute right-4 top-4 text-5xl font-black text-red-50 transition group-hover:text-red-100">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="relative">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#BE1E2D] text-white shadow-lg shadow-red-950/15">
                          <Icon className="h-6 w-6" />
                        </div>

                        <h3 className="mt-5 text-xl font-black">{step.title}</h3>

                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#BE1E2D] px-6 py-14 text-center text-white shadow-2xl shadow-red-950/20 sm:px-10 sm:py-16">
              <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-red-950/25 blur-2xl" />

              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur">
                  <BedDouble className="h-6 w-6" />
                </div>

                <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
                  Siap Menemukan Rumah Kedua Kamu?
                </h2>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80">
                  Mulai pencarian sekarang dan nikmati masa kuliah dengan hunian
                  yang nyaman, aman, dan berkualitas.
                </p>

                <Link
                  href="/kost"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-black text-[#BE1E2D] shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5 hover:bg-red-50 hover:shadow-xl"
                >
                  Cari Kost Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <SiteFooter />
    </div>
  );
}