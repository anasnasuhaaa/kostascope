"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Search } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Daftar Kost",
    href: "/kost",
  },
  {
    label: "Tentang",
    href: "/about",
  },
];

function isNavigationActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /**
   * Tutup menu mobile secara otomatis
   * saat pengguna berpindah halaman.
   */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-red-100/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =========================================================
            LOGO
        ========================================================== */}
        <Link
          href="/"
          aria-label="Kembali ke halaman utama AngkasaKost"
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-red-50 ring-1 ring-red-100 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-sm">
            <Image
              src="/kostalogo.png"
              alt="Logo AngkasaKost"
              width={36}
              height={36}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div className="leading-tight">
            <p className="text-lg font-black tracking-tight text-[#BE1E2D]">
              AngkasaKost
            </p>

            <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400 sm:block">
              Kost Sekitar IPB Dramaga
            </p>
          </div>
        </Link>

        {/* =========================================================
            MENU DESKTOP
        ========================================================== */}
        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => {
            const isActive = isNavigationActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative rounded-xl px-4 py-2 text-sm font-bold transition duration-300",
                  isActive
                    ? "bg-red-50 text-[#BE1E2D]"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-[#BE1E2D]",
                ].join(" ")}
              >
                {item.label}

                {/* {isActive && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#BE1E2D]" />
                )} */}
              </Link>
            );
          })}
        </nav>

        {/* =========================================================
            CTA DESKTOP
        ========================================================== */}
        <div className="hidden md:block">
          <Link
            href="/kost"
            className="group inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] px-4 text-sm font-black text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[#9F1725] hover:shadow-md hover:shadow-red-950/10"
          >
            Cari Kost

            <Search className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* =========================================================
            TOMBOL MOBILE
        ========================================================== */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-[#BE1E2D] transition duration-300 hover:bg-red-50 md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* =========================================================
          MENU MOBILE
      ========================================================== */}
      <div
        id="mobile-navigation"
        className={[
          "grid overflow-hidden border-t border-red-100 bg-white transition-all duration-300 ease-out md:hidden",
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] border-t-transparent opacity-0",
        ].join(" ")}
      >
        <div className="min-h-0">
          <nav
            aria-label="Navigasi mobile"
            className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6"
          >
            {navItems.map((item) => {
              const isActive = isNavigationActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition duration-300",
                    isActive
                      ? "bg-red-50 text-[#BE1E2D]"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-[#BE1E2D]",
                  ].join(" ")}
                >
                  <span>{item.label}</span>

                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#BE1E2D]" />
                  )}
                </Link>
              );
            })}

            <Link
              href="/kost"
              className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] px-4 text-sm font-black text-white shadow-sm transition duration-300 hover:bg-[#9F1725]"
            >
              Cari Kost Sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}