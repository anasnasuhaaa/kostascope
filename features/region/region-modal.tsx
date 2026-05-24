"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createRegionAction,
  updateRegionAction,
} from "@/features/region/actions";

type RegionModalProps = {
  mode: "create" | "edit";
  region?: {
    id: string;
    name: string;
  };
};

export default function RegionModal({ mode, region }: RegionModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === "edit";

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        isEdit && region
          ? await updateRegionAction(region.id, formData)
          : await createRegionAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button>Tambah Wilayah</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Wilayah" : "Tambah Wilayah"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah nama wilayah kost."
              : "Tambahkan wilayah baru untuk kategori lokasi kost."}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`name-${region?.id ?? "create"}`}>
              Nama Wilayah
            </Label>
            <Input
              id={`name-${region?.id ?? "create"}`}
              name="name"
              required
              minLength={2}
              defaultValue={region?.name ?? ""}
              placeholder="Contoh: Bara"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}