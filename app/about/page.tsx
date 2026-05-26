import Link from "next/link";

import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

const values = [
  {
    title: "Responsif",
    description: "Informasi disusun agar mudah diakses di berbagai perangkat.",
  },
  {
    title: "Mudah Diakses",
    description: "Cari wilayah, fasilitas, dan harga dalam satu alur sederhana.",
  },
  {
    title: "Terstruktur",
    description: "Data kost ditampilkan rapi untuk memudahkan perbandingan.",
  },
  {
    title: "Informatif",
    description: "Detail penting seperti harga, fasilitas, dan kontak tersedia jelas.",
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
        <section className="relative overflow-hidden bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF] py-24">
          <div className="absolute -left-40 top-32 h-80 w-80 rounded-full bg-[#BE1E2D]/15 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#BE1E2D]/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-5 inline-flex rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-[#BE1E2D]">
                Visi & Misi Kami
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Tentang <span className="text-[#BE1E2D]">Kostascope</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-600">
                Membantu mahasiswa dan calon mahasiswa IPB memahami pilihan
                hunian dengan cara yang lebih mudah, rapi, dan relevan dengan
                kebutuhan hidup di kampus.
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-[#4A0D16] p-3 shadow-2xl shadow-red-950/20">
                <div className="aspect-4/3 rounded-2xl bg-linear-to-br from-red-50 via-white to-[#BE1E2D]/20" />
              </div>

              <div className="absolute -bottom-8 left-8 rounded-2xl border border-red-100 bg-white p-5 shadow-xl">
                <p className="text-sm font-semibold text-zinc-500">
                  Dikelola oleh
                </p>
                <p className="mt-1 font-black text-[#BE1E2D]">
                  Ormawa Eksekutif PKU IPB
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
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
        </section>

        <section className="bg-[#F4F6FF] py-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight">
              Nilai yang Kami Bawa
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Standar kualitas dalam setiap informasi yang kami sajikan.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-red-100 bg-white p-6 text-left shadow-sm"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D]">
                    ✦
                  </div>
                  <h3 className="text-lg font-black">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="overflow-hidden rounded-3xl border border-red-100 bg-white p-3 shadow-xl shadow-red-950/5">
              <div className="aspect-4/3 rounded-2xl bg-linear-to-br from-zinc-100 via-white to-[#BE1E2D]/10" />
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Dibangun untuk Mahasiswa
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

        <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8">
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
        </section>

        <section className="bg-[#FAFAFC] px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black tracking-tight">
            Siap Menemukan Hunianmu?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-600">
            Mulai eksplorasi katalog kost kami yang telah dikurasi dan temukan
            kenyamanan terbaik selama masa studium.
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