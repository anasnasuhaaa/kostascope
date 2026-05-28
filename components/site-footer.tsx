import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-red-100 bg-[#F4F6FF]">
      <div className="mx-auto flex max-w-7xl flex-row gap-6 px-4 py-8 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
        <div className="hidden md:flex items-center justify-center gap-2 text-xl font-extrabold tracking-tight text-[#BE1E2D]">
          <h2 className="text-xl font-extrabold text-[#BE1E2D]">
            AngkasaKost
          </h2>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-[#BE1E2D] md:justify-end">
            <a
              href="https://www.instagram.com/ormawaeksekutifpku"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 ring-1 ring-red-100 transition hover:bg-red-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
              </svg>
              @ormawaeksekutifpku
            </a>

            <a
              href="https://www.instagram.com/nextin.pku"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 ring-1 ring-red-100 transition hover:bg-red-100"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
              </svg>
              @nextin.pku
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-red-100 px-4 py-4 text-center text-xs leading-5 text-zinc-500">
        © 2026 Biro Riset dan Teknologi, Ormawa Eksekutif PKU IPB. All rights
        reserved.
      </div>
    </footer>
  );
}