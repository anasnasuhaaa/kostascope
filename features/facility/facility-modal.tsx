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
  createFacilityAction,
  updateFacilityAction,
} from "@/features/facility/actions";

type FacilityModalProps = {
  mode: "create" | "edit";
  facility?: {
    id: string;
    name: string;
  };
};

export default function FacilityModal({
  mode,
  facility,
}: FacilityModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === "edit";

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        isEdit && facility
          ? await updateFacilityAction(facility.id, formData)
          : await createFacilityAction(formData);

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
          <Button>Tambah Fasilitas</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Fasilitas" : "Tambah Fasilitas"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah nama fasilitas kost."
              : "Tambahkan fasilitas baru untuk data kost."}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`name-${facility?.id ?? "create"}`}>
              Nama Fasilitas
            </Label>
            <Input
              id={`name-${facility?.id ?? "create"}`}
              name="name"
              required
              minLength={2}
              defaultValue={facility?.name ?? ""}
              placeholder="Contoh: AC"
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