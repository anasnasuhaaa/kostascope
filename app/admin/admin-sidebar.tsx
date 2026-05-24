"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export const adminMenus = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Kost",
    href: "/admin/kost",
  },
  {
    label: "Wilayah",
    href: "/admin/regions",
  },
  {
    label: "Fasilitas",
    href: "/admin/facilities",
  },
];

export function AdminMenuList({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {adminMenus.map((menu) => {
        const isActive =
          menu.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(menu.href);

        return (
          <Link
            key={menu.href}
            href={menu.href}
            onClick={onNavigate}
            className={[
              "block rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-black text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {menu.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="w-full rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      Logout
    </button>
  );
}

export default function AdminSidebar({
  email,
}: {
  email?: string | null;
}) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r bg-background lg:flex">
      <div className="border-b px-6 py-5">
        <h1 className="text-lg font-bold">Kostascope</h1>
        <p className="mt-1 text-xs text-muted-foreground">Admin Panel</p>
      </div>

      <div className="flex-1 px-3 py-4">
        <AdminMenuList />
      </div>

      <div className="border-t p-4">
        <p className="mb-3 truncate text-xs text-muted-foreground">
          {email}
        </p>

        <AdminLogoutButton />
      </div>
    </aside>
  );
}