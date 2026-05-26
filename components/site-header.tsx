"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Kost",
    href: "/kost",
  },
  {
    label: "About",
    href: "/about",
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-red-100/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[#BE1E2D]"
        >
          <Image
            src="/kostalogo.png"
            alt="Kostascope Logo"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-lg object-contain"
          />
          <span>AngkasaKost</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "relative text-sm font-medium transition hover:text-[#BE1E2D]",
                  isActive ? "text-[#BE1E2D]" : "text-zinc-700",
                ].join(" ")}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#BE1E2D]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/kost"
            className="rounded-md bg-[#BE1E2D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f1725]"
          >
            Cari Kost
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-red-100 text-[#BE1E2D] transition hover:bg-red-50 md:hidden"
        >
          <span className="relative h-5 w-5">
            <span
              className={[
                "absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300",
                open ? "-translate-y-1/2 rotate-45" : "-translate-y-1.75",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-all duration-300",
                open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-1/2 top-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-all duration-300",
                open ? "-translate-y-1/2 -rotate-45" : "translate-y-1.75",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-red-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-red-50 text-[#BE1E2D]"
                      : "text-zinc-700 hover:bg-zinc-50",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/kost"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-[#BE1E2D] px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Cari Kost
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}