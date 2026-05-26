import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-red-100 bg-[#F4F6FF]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-2xl font-extrabold text-[#BE1E2D]">Kostascope</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-600">
            Platform informasi kost untuk membantu mahasiswa menemukan hunian
            yang sesuai di sekitar IPB.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-zinc-900">Tautan</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li>
              <Link href="/" className="hover:text-[#BE1E2D]">
                Home
              </Link>
            </li>
            <li>
              <Link href="/kost" className="hover:text-[#BE1E2D]">
                Kost
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-[#BE1E2D]">
                About
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-zinc-900">Legal</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li>Kebijakan Privasi</li>
            <li>Syarat & Ketentuan</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-zinc-900">Kontak</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li>Email: kostascope@ipb.ac.id</li>
            <li>Website: pku.ipb.ac.id</li>
            <li>Instagram: @eksekutifpkuipb</li>
            <li>Narahubung: 6281234567890</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-red-100 px-4 py-5 text-center text-xs text-zinc-500">
        © 2026 Ormawa Eksekutif PKU IPB. All rights reserved.
      </div>
    </footer>
  );
}