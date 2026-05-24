import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminMobileHeader from "./admin-mobile-header";
import AdminSidebar from "./admin-sidebar";

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
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar email={session.user.email} />

      <div className="min-h-screen lg:pl-64">
        <AdminMobileHeader email={session.user.email} />

        <header className="hidden border-b bg-background/95 px-8 py-4 backdrop-blur lg:block">
          <div>
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            <p className="text-xs text-muted-foreground">
              Kelola data informasi kost.
            </p>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}