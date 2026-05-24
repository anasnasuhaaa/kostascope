"use client";

import { useState } from "react";

import {
  AdminLogoutButton,
  AdminMenuList,
} from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AdminMobileHeader({
  email,
}: {
  email?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold">Kostascope</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Kostascope Admin</SheetTitle>
            </SheetHeader>

            <div className="mt-6 flex h-[calc(100vh-96px)] flex-col">
              <div className="flex-1">
                <AdminMenuList onNavigate={() => setOpen(false)} />
              </div>

              <div className="border-t pt-4">
                <p className="mb-3 truncate text-xs text-muted-foreground">
                  {email}
                </p>

                <AdminLogoutButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}