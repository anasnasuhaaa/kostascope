"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Building2,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MapPin,
  PanelLeftClose,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type AdminRole = "ADMIN" | "SUPER_ADMIN";

const adminMenus = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Kost",
    href: "/admin/kost",
    icon: Building2,
  },
  {
    label: "Wilayah",
    href: "/admin/regions",
    icon: MapPin,
  },
  {
    label: "Fasilitas",
    href: "/admin/facilities",
    icon: ListChecks,
  },
];

const superAdminMenus = [
  {
    label: "User",
    href: "/admin/users",
    icon: Users,
  },
];

function getVisibleMenus(role?: AdminRole) {
  if (role === "SUPER_ADMIN") {
    return [...adminMenus, ...superAdminMenus];
  }

  return adminMenus;
}

function isMenuActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname.startsWith(href);
}

export default function AdminSidebar({
  email,
  role,
}: {
  email?: string | null;
  role?: AdminRole;
}) {
  const pathname = usePathname();
  const visibleMenus = getVisibleMenus(role);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex h-12 items-center gap-3 px-2">
          <Link
            href="/admin"
            className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
          >
            {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black text-white">
              <Home className="h-4 w-4" />
            </div> */}

            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <h1 className="truncate text-lg font-bold leading-none">
                AngkasaKost
              </h1>
            </div>
          </Link>

          <SidebarTrigger className="hidden shrink-0 lg:inline-flex">
            <PanelLeftClose className="h-4 w-4" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenus.map((menu) => {
                const Icon = menu.icon;
                const isActive = isMenuActive(pathname, menu.href);

                return (
                  <SidebarMenuItem key={menu.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={menu.label}
                      isActive={isActive}
                      className={[
                        "h-10 gap-3 rounded-lg px-3 text-sm font-medium",
                        isActive
                          ? "bg-black! text-white! hover:bg-black1 hover:text-white!"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      ].join(" ")}
                    >
                      <Link href={menu.href}>
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {menu.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="space-y-3 p-2">
          <p className="truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
            {email}
          </p>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition hover:bg-muted group-data-[collapsible=icon]:px-0"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">
              Logout
            </span>
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}