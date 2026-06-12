"use client";

import { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type KostFilterSheetProps = {
  children: ReactNode;
  activeFilterCount: number;
};

export default function KostFilterSheet({
  children,
  activeFilterCount,
}: KostFilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 rounded-xl border-red-100 bg-white px-4 text-sm font-black text-[#BE1E2D] shadow-sm hover:bg-red-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter

          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#BE1E2D] px-1 text-[10px] font-black text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-red-100 px-5 py-5 text-left">
          <SheetTitle className="text-xl font-black">
            Filter Kos
          </SheetTitle>

          <SheetDescription>
            Pilih kriteria kost sesuai kebutuhanmu.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}