import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";

const needs = [
  "Dekat kampus",
  "Harga bulanan",
  "Fasilitas lengkap",
  "Kost putra / putri / campur",
  "AC",
  "Wifi",
];

const benefits = [
  {
    title: "Data Terstruktur",
    description:
      "Informasi kost disusun rapi mulai dari wilayah, harga, fasilitas, hingga kontak narahubung.",
  },
  {
    title: "Filter Cerdas",
    description:
      "Cari kost berdasarkan wilayah, tipe penghuni, fasilitas, dan kebutuhan sewa.",
  },
  {
    title: "Info Harga",
    description:
      "Transparansi harga bulanan, enam bulanan, dan tahunan dalam satu tempat.",
  },
  {
    title: "Kontak Langsung",
    description:
      "Hubungi narahubung kost secara langsung untuk proses pengecekan lebih lanjut.",
  },
];

const steps = [
  {
    title: "Cari",
    description: "Gunakan pencarian untuk menemukan wilayah atau nama kost.",
  },
  {
    title: "Filter",
    description: "Saring hasil berdasarkan kebutuhan dan preferensi.",
  },
  {
    title: "Detail",
    description: "Pelajari harga, fasilitas, lokasi, dan informasi penting.",
  },
  {
    title: "Hubungi",
    description: "Klik WhatsApp untuk menghubungi narahubung kost.",
  },
];

function HouseVector() {
  return (
    <div className="relative mx-auto w-full max-w-130">
      <div className="absolute -left-4 top-8 h-28 w-28 rounded-full bg-[#BE1E2D]/15 blur-2xl sm:-left-8 sm:h-40 sm:w-40" />
      <div className="absolute -right-3 bottom-10 h-28 w-28 rounded-full bg-[#BE1E2D]/10 blur-2xl sm:-right-8 sm:h-44 sm:w-44" />

      <div className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-white p-4 shadow-2xl shadow-red-950/10 sm:p-6">
        <div className="absolute right-6 top-6 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-[#BE1E2D] shadow-sm">
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
          <path
            d="M340 88L542 222H138L340 88Z"
            fill="#BE1E2D"
          />
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

      <div className="absolute -bottom-6 left-4 hidden rounded-2xl border border-red-100 bg-white p-4 shadow-xl shadow-red-950/10 sm:block">
        <p className="text-xs font-semibold text-zinc-500">Dikelola Oleh</p>
        <p className="text-md font-black text-[#BE1E2D]">Ormawa Eksekutif PKU IPB</p>
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
  const sixMonths = prices.find((price) => price.type === "SIX_MONTHS");
  const yearly = prices.find((price) => price.type === "YEARLY");

  return monthly ?? sixMonths ?? yearly ?? prices[0];
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
    return "grid gap-5 grid-cols-1";
  }

  if (count === 2) {
    return "grid gap-5 grid-cols-2";
  }

  if (count === 3) {
    return "grid gap-5 grid-cols-2 md:grid-cols-3";
  }

  if (count === 4) {
    return "grid gap-5 grid-cols-2 md:grid-cols-4";
  }

  return "grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-5";
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
        <section className="relative overflow-hidden bg-linear-to-br from-white via-[#FFF7F8] to-[#F7F8FF]">
          <div className="absolute -left-32 top-28 h-72 w-72 rounded-full bg-[#BE1E2D]/10 blur-3xl" />
          <div className="absolute -right-24 bottom-16 h-80 w-80 rounded-full bg-[#BE1E2D]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-[#BE1E2D]">
                Selamat Datang Mahasiswa Baru IPB Angkatan 63!
              </div>

              <h1 className="mx-auto max-w-2xl text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl lg:mx-0 lg:text-6xl">
                Temukan Kost Ideal di{" "}
                <span className="text-[#BE1E2D]">Sekitar IPB Dramaga</span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-zinc-600 lg:mx-0">
                Akses informasi kost yang lebih mudah, rapi, dan relevan dengan kebutuhan kamu di IPB.
              </p>

              <form
                action="/kost"
                className="mx-auto mt-8 hidden max-w-2xl gap-3 rounded-2xl border border-red-100 bg-white p-3 shadow-2xl shadow-red-950/10 sm:grid sm:grid-cols-[1.4fr_1fr_auto] lg:mx-0"
              >
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#BE1E2D]">
                    ⌕
                  </span>
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
                    <option value="SIX_MONTHS">6 Bulan</option>
                    <option value="YEARLY">1 Tahun</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#BE1E2D]">
                    ▼
                  </span>
                </div>

                <button className="h-12 rounded-xl bg-[#BE1E2D] px-8 text-sm font-bold text-white shadow-lg shadow-red-950/15 transition hover:bg-[#9f1725]">
                  Cari
                </button>
              </form>

              {/* <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm font-semibold lg:justify-start">
                <Link href="/kost" className="text-[#BE1E2D]">
                  Mulai Cari →
                </Link>
                <Link href="#wilayah" className="text-zinc-700">
                  Lihat Wilayah
                </Link>
              </div> */}
            </div>

            <div className="lg:pl-8">
              <HouseVector />
            </div>
          </div>
        </section>

        {featuredKosts.length > 0 && (
          <section className="relative overflow-hidden bg-white py-16 sm:py-20">
            <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#BE1E2D]/5 blur-3xl" />
            <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-2xl">
                  <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-[#BE1E2D] ring-1 ring-red-100 sm:mb-4 sm:gap-3 sm:rounded-full sm:px-4">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#BE1E2D] text-[10px] font-black text-white sm:h-6 sm:w-6 sm:text-xs">
                      ✓
                    </span>

                    <h2 className="text-lg font-black tracking-tight text-[#BE1E2D] sm:text-3xl lg:text-4xl">
                      Kost Rekomendasi Kami
                    </h2>
                  </div>


                  <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                    Pilihan Kost terbaik untuk kamu yang menginginkan kenyamanan, keamanan, dan akses mudah ke kampus IPB Dramaga.
                  </p>
                </div>
                {/* 
                <Link
                  href="/kost"
                  className="inline-flex w-fit rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-black text-[#BE1E2D] shadow-sm transition hover:bg-red-50"
                >
                  Lihat Semua Kost
                </Link> */}
              </div>

              <div className={getFeaturedGridClassName(featuredKosts.slice(0, 5).length)}>
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
                            fill
                            className="object-cover transition duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="rounded-xl bg-white px-4 py-2 text-xs font-black text-[#BE1E2D] shadow-sm">
                              Kostascope
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black text-[#BE1E2D] shadow-sm backdrop-blur">
                            Rekomendasi
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-[#BE1E2D]">
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

                        <p className="mt-2 text-xs text-zinc-500">
                          {formatDistance(kost.distanceToCampusInMeters)}
                        </p>

                        <div className="mt-4 rounded-2xl bg-[#FFF7F8] p-3">
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
                          <div className="flex h-10 items-center justify-center rounded-xl bg-[#BE1E2D] text-xs font-black text-white transition group-hover:bg-[#9f1725]">
                            Lihat Detail
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="grid gap-5 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-red-950/5"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D]">
                    ✦
                  </div>
                  <h3 className="text-lg font-black">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-black uppercase tracking-widest text-[#BE1E2D]">
                Keunggulan Kami
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                Mendefinisikan Ulang Pengalaman Mencari Kost Mahasiswa
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Kami memahami bahwa tempat tinggal adalah pondasi kenyamanan
                belajar. Kostascope hadir untuk menjawab kebingungan Maba!
              </p>

              <div className="mt-6 space-y-3 text-sm font-semibold text-zinc-700">
                <p>✓ Verifikasi lokasi & fasilitas fisik</p>
                <p>✓ Update ketersediaan kamar real-time</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F4F6FF] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight">
              Cari Berdasarkan Kebutuhan
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Pilih kategori yang paling sesuai dengan prioritas harian Kamu.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {needs.map((need) => (
                <Link
                  key={need}
                  href="/kost"
                  className="rounded-full border border-red-100 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-[#BE1E2D] hover:text-[#BE1E2D]"
                >
                  {need}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="wilayah" className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight">
                Wilayah Sekitar IPB
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Bogor memiliki beragam area strategis. Tentukan yang paling
                dekat dengan aktivitas Kamu.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((region, index) => (
                <Link
                  key={region.id}
                  href={`/kost?regionId=${region.id}`}
                  className={[
                    "group relative overflow-hidden rounded-3xl bg-zinc-900 p-6 text-white shadow-xl shadow-zinc-950/10",
                    index === 0 ? "lg:col-span-2 lg:row-span-2" : "",
                  ].join(" ")}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#BE1E2D]/80 via-zinc-950/40 to-zinc-950" />
                  <div className="absolute inset-0 opacity-30 transition duration-500 group-hover:scale-110">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.5),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(190,30,45,0.6),transparent_40%)]" />
                  </div>

                  <div className="relative flex min-h-52 flex-col justify-end">
                    <h3 className="text-2xl font-black">{region.name}</h3>
                    <p className="mt-2 max-w-sm text-sm text-white/80">
                      {region._count.kosts} kost tersedia di area ini.
                    </p>
                    <span className="mt-4 inline-flex w-fit rounded-md bg-white px-4 py-2 text-xs font-bold text-[#BE1E2D]">
                      Lihat Kost
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F4F6FF] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight">
              Bagaimana Cara Kerjanya?
            </h2>
            <p className="mt-3 text-sm text-zinc-600">
              Langkah sederhana untuk mendapatkan hunian impian.
            </p>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#BE1E2D] text-lg font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#BE1E2D] px-6 py-14 text-center text-white shadow-2xl shadow-red-950/20 sm:px-10 sm:py-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
              Siap Menemukan Rumah Kedua Kamu?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80">
              Mulai pencarian sekarang dan nikmati masa kuliah dengan hunian
              yang nyaman, aman, dan berkualitas.
            </p>
            <Link
              href="/kost"
              className="mt-8 inline-flex rounded-xl bg-white px-8 py-3 text-sm font-black text-[#BE1E2D] transition hover:bg-red-50"
            >
              Cari Kost Sekarang
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}