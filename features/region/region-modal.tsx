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
        publicRelationName: string | null;
        publicRelationWhatsapp: string | null;
      };
    };

export default function RegionModal({
  mode,
  region,
}: RegionModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [publicRelationName, setPublicRelationName] = useState("");
  const [publicRelationWhatsapp, setPublicRelationWhatsapp] = useState("");

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode) {
      setName(region.name);
      setPublicRelationName(region.publicRelationName ?? "");
      setPublicRelationWhatsapp(region.publicRelationWhatsapp ?? "");
      return;
    }

    setName("");
    setPublicRelationName("");
    setPublicRelationWhatsapp("");
  }, [open, isEditMode, region]);

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
            Isi nama wilayah dan Public Relation yang bertanggung jawab
            menangani pertanyaan calon penghuni.
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

          <div className="space-y-2">
            <label
              htmlFor="public-relation-name"
              className="text-sm font-medium"
            >
              Nama Public Relation
            </label>

            <input
              id="public-relation-name"
              name="publicRelationName"
              type="text"
              value={publicRelationName}
              disabled={isPending}
              onChange={(event) =>
                setPublicRelationName(event.target.value)
              }
              placeholder="Contoh: Anas Nasuha"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="public-relation-whatsapp"
              className="text-sm font-medium"
            >
              Nomor WhatsApp Public Relation
            </label>

            <input
              id="public-relation-whatsapp"
              name="publicRelationWhatsapp"
              type="text"
              inputMode="numeric"
              value={publicRelationWhatsapp}
              disabled={isPending}
              onChange={(event) =>
                setPublicRelationWhatsapp(
                  event.target.value.replace(/\D/g, ""),
                )
              }
              placeholder="Contoh: 6281234567890"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              required
            />

            <p className="text-xs text-muted-foreground">
              Gunakan format 628..., tanpa tanda tambah, spasi, atau tanda
              hubung.
            </p>
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