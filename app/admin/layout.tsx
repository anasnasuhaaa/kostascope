import { redirect } from "next/navigation";

import { auth } from "@/auth";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import AdminSidebar from "./admin-sidebar";
import LoginSuccessToast from "./login-success-toast";

type AdminRole = "ADMIN" | "SUPER_ADMIN";

function getRoleLabel(role?: AdminRole) {
  if (role === "SUPER_ADMIN") {
    return "Super Admin";
  }

  return "Admin";
}

function getRoleClassName(role?: AdminRole) {
  if (role === "SUPER_ADMIN") {
    return "bg-red-50 text-[#BE1E2D] ring-red-100";
  }

  return "bg-blue-50 text-blue-700 ring-blue-100";
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/30">
          <AdminSidebar email={session.user.email} role={session.user.role} />

          <SidebarInset>
            <LoginSuccessToast />

            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
              <SidebarTrigger className="lg:hidden" />

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold sm:text-lg">
                    Hallo {session.user.name ?? "Admin"}
                  </h2>

                  <span
                    className={[
                      "inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
                      getRoleClassName(session.user.role),
                    ].join(" ")}
                  >
                    {getRoleLabel(session.user.role)}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Semangat ngolahnya yaa..
                </p>
              </div>
            </header>

            <main className="px-4 py-4 sm:px-6 lg:px-8 lg:py-4">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}