"use client";

import { useEffect, useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  createRegionAction,
  updateRegionAction,
} from "@/features/region/actions";

/**
 * ============================================================
 * PROPS REGION MODAL
 * ============================================================
 *
 * RegionModal hanya bertugas:
 * - menambahkan wilayah;
 * - mengubah nama wilayah.
 *
 * Public Relation tidak lagi dikelola dari modal ini.
 * Gunakan RegionPublicRelationModal untuk mengelola PR.
 */
type RegionModalProps =
  | {
      mode: "create";
      region?: never;
    }
  | {
      mode: "edit";
      region: {
        id: string;
        name: string;
      };
    };

export default function RegionModal({
  mode,
  region,
}: RegionModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");

  const isEditMode = mode === "edit";

  /**
   * Isi form ketika modal edit dibuka.
   * Kosongkan form ketika modal tambah dibuka.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode) {
      setName(region.name);
      return;
    }

    setName("");
  }, [open, isEditMode, region]);

  /**
   * Simpan data wilayah.
   *
   * - mode edit   → updateRegionAction()
   * - mode create → createRegionAction()
   */
  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = isEditMode
        ? await updateRegionAction(region.id, formData)
        : await createRegionAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditMode ? (
          <Button type="button" variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        ) : (
          <Button type="button">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Wilayah
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Wilayah" : "Tambah Wilayah"}
          </DialogTitle>

          <DialogDescription>
            {isEditMode
              ? "Perbarui nama wilayah kost."
              : "Tambahkan wilayah kost baru. Public Relation dapat ditambahkan setelah wilayah berhasil dibuat."}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="region-name"
              className="text-sm font-medium"
            >
              Nama Wilayah
            </label>

            <input
              id="region-name"
              name="name"
              type="text"
              value={name}
              disabled={isPending}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Bara"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : isEditMode
                  ? "Simpan Perubahan"
                  : "Tambah Wilayah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}