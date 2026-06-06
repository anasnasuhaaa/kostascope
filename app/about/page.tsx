import Link from "next/link";
import Image from "next/image";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

import {
  Accessibility,
  Info,
  LayoutList,
  Search,
  Sparkles,
} from "lucide-react";

const values = [
  {
    title: "Responsif",
    description: "Informasi disusun agar mudah diakses di berbagai perangkat.",
    icon: Accessibility,
  },
  {
    title: "Mudah Diakses",
    description: "Cari wilayah, fasilitas, dan harga dalam satu alur sederhana.",
    icon: Search,
  },
  {
    title: "Terstruktur",
    description: "Data kost ditampilkan rapi untuk memudahkan perbandingan.",
    icon: LayoutList,
  },
  {
    title: "Informatif",
    description:
      "Detail penting seperti harga, fasilitas, dan kontak tersedia jelas.",
    icon: Info,
  },
];

const timeline = [
  {
    title: "Memahami Kebutuhan",
    description:
      "Membantu mahasiswa mencari kost dengan sistem yang lebih cepat dan rapi.",
  },
  {
    title: "Menata Informasi",
    description:
      "Menyajikan data kost dalam bentuk yang mudah dicari dan dibandingkan.",
  },
  {
    title: "Menyediakan Referensi",
    description:
      "Menghadirkan referensi hunian sesuai wilayah, fasilitas, dan kebutuhan.",
  },
  {
    title: "Menghubungkan Mahasiswa",
    description:
      "Memudahkan pencari kost menghubungi narahubung untuk proses lanjutan.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-zinc-950">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF] py-10 md:py-24">
          <div className="absolute -left-40 top-32 h-80 w-80 rounded-full bg-[#BE1E2D]/15 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#BE1E2D]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-8 md:gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              {/* <div className="mb-5 inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-[#BE1E2D]">
                Visi & Misi Kami
              </div> */}
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Tentang <span className="text-[#BE1E2D]">AngkasaKost</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600">
                AngkasaKost hadir sebagai program kerja Biro Riset dan Teknologi Ormawa Eksekutif PKU untuk membantu mahasiswa baru IPB mengenal berbagai pilihan kost di sekitar Kampus IPB Dramaga. Dengan informasi yang disusun secara rapi dan mudah dipahami, AngkasaKost diharapkan dapat mempermudah proses pencarian hunian bagi mahasiswa baru.
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-[#4A0D16] p-3 shadow-2xl shadow-red-950/20">
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-red-50">
                  <Image
                    src="/img_about/about3.jpeg"
                    alt="Tentang AngkasaKost"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="absolute -bottom-8 left-8 rounded-2xl border border-red-100 bg-white p-3 md:p-5 shadow-xl">
                <p className="text-sm font-semibold text-zinc-500">
                  Dikelola oleh
                </p>
                <p className="mt-1 font-black text-[#BE1E2D]">
                  Biro Riset dan Teknologi, Ormawa Eksekutif PKU IPB
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <p className="border-l-4 border-[#BE1E2D] pl-4 text-2xl font-black text-[#BE1E2D]">
                Perjalanan Kami
              </p>
            </div>

            <div className="space-y-6 text-base leading-8 text-zinc-600">
              <p>
                Kostascope hadir untuk memberikan ruang informasi hunian yang
                lebih rapi dan mudah dipahami. Pencarian kost sering kali
                memakan waktu karena data tersebar, tidak seragam, dan sulit
                dibandingkan.
              </p>
              <p>
                Melalui Kostascope, informasi seperti wilayah, harga sewa,
                fasilitas, ukuran kamar, biaya air, listrik, hingga narahubung
                ditampilkan dalam satu platform yang mudah digunakan.
              </p>
              <p>
                Harapannya, mahasiswa dapat menemukan hunian yang sesuai dengan
                kebutuhan, jarak, dan preferensi tanpa harus kehilangan banyak
                waktu dalam proses pencarian.
              </p>
            </div>
          </div>
        </section> */}

  <section className="relative overflow-hidden bg-[#F4F6FF] py-16 sm:py-20">
          <div className="absolute left-1/2 top-0 h-52 w-96 -translate-x-1/2 rounded-full bg-[#BE1E2D]/5 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-[#BE1E2D]/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#BE1E2D] shadow-sm ring-1 ring-red-100">
              <Sparkles className="h-5 w-5" />
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
              Nilai yang Kami Bawa
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Standar kualitas dalam setiap informasi yang kami sajikan.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="group relative overflow-hidden rounded-3xl border border-red-100 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5 sm:p-6"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100 transition duration-300 group-hover:bg-[#BE1E2D] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="text-lg font-black tracking-tight">
                        {value.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>


        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-red-100 bg-white p-3 shadow-xl shadow-red-950/5">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src="/img_about/about2.jpg"
                  alt="Kostascope untuk mahasiswa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Membantu Maba Menentukan Pilihan Hunian
              </h2>
              <p className="mt-5 text-base leading-8 text-zinc-600">
                Setiap fitur dirancang untuk mengurangi kebingungan dalam
                mencari kost. Mulai dari pencarian wilayah, filter fasilitas,
                hingga kontak langsung ke narahubung.
              </p>

              <div className="mt-8 space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#BE1E2D] text-sm font-black text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-black">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-zinc-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#BE1E2D] px-6 py-14 text-center text-white shadow-2xl shadow-red-950/20">
            <p className="mx-auto mb-4 inline-flex rounded-lg border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold">
              Ormawa Eksekutif PKU IPB
            </p>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Otoritas & Pengelolaan
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80">
              Kostascope merupakan upaya untuk menghadirkan akses informasi
              hunian yang lebih transparan, terstruktur, dan dikelola secara
              profesional.
            </p>
          </div>
        </section> */}

        <section className="bg-[#FAFAFC] px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight">
            Siap Menemukan Hunianmu?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
            Mulai eksplorasi katalog kost yang telah kami sediakan.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/kost"
              className="rounded-xl bg-[#BE1E2D] px-8 py-3 text-sm font-black text-white hover:bg-[#9f1725]"
            >
              Lihat Daftar Kost
            </Link>
            <Link
              href="/"
              className="rounded-xl border border-[#BE1E2D] px-8 py-3 text-sm font-black text-[#BE1E2D] hover:bg-red-50"
            >
              Kembali ke Home
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}