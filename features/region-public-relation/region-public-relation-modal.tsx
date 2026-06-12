"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Power, Trash2, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
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
  createRegionPublicRelationAction,
  deleteRegionPublicRelationAction,
  toggleRegionPublicRelationAction,
  updateRegionPublicRelationAction,
} from "@/features/region-public-relation/action";

type PublicRelation = {
  id: string;
  name: string;
  whatsapp: string;
  isActive: boolean;
  assignmentCount: number;
};

type RegionPublicRelationModalProps = {
  region: {
    id: string;
    name: string;
    publicRelations: PublicRelation[];
  };
};

type EditablePublicRelation = {
  id: string;
  name: string;
  whatsapp: string;
};

export default function RegionPublicRelationModal({
  region,
}: RegionPublicRelationModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [newName, setNewName] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");

  const [editablePublicRelation, setEditablePublicRelation] =
    useState<EditablePublicRelation | null>(null);

  function normalizeWhatsapp(value: string) {
    return value.replace(/\D/g, "");
  }

  function resetCreateForm() {
    setNewName("");
    setNewWhatsapp("");
  }

  function handleCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createRegionPublicRelationAction(
        region.id,
        formData,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      resetCreateForm();
      router.refresh();
    });
  }

  function handleUpdate(formData: FormData) {
    if (!editablePublicRelation) {
      return;
    }

    startTransition(async () => {
      const result = await updateRegionPublicRelationAction(
        editablePublicRelation.id,
        formData,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setEditablePublicRelation(null);
      router.refresh();
    });
  }

  function handleToggle(publicRelationId: string) {
    startTransition(async () => {
      const result = await toggleRegionPublicRelationAction(
        publicRelationId,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function handleDelete(publicRelationId: string) {
    const confirmed = window.confirm(
      "Hapus Public Relation ini? Data yang sudah dihapus tidak dapat dikembalikan.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteRegionPublicRelationAction(
        publicRelationId,
      );

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <UsersRound className="mr-2 h-4 w-4" />
          Kelola PR ({region.publicRelations.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Public Relation Wilayah {region.name}
          </DialogTitle>

          <DialogDescription>
            Tambahkan beberapa Public Relation agar pertanyaan pengguna
            dapat dibagikan secara merata.
          </DialogDescription>
        </DialogHeader>

        {/* =========================================================
            FORM TAMBAH PR
        ========================================================== */}
        <form
          action={handleCreate}
          className="space-y-4 rounded-2xl border border-red-100 bg-red-50/40 p-4"
        >
          <div>
            <h3 className="font-black">Tambah Public Relation</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Gunakan nomor WhatsApp dengan format 628...
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor={`new-pr-name-${region.id}`}
                className="text-sm font-medium"
              >
                Nama Public Relation
              </label>

              <input
                id={`new-pr-name-${region.id}`}
                name="name"
                type="text"
                value={newName}
                disabled={isPending}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Contoh: Anas Nasuha"
                className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor={`new-pr-whatsapp-${region.id}`}
                className="text-sm font-medium"
              >
                Nomor WhatsApp
              </label>

              <input
                id={`new-pr-whatsapp-${region.id}`}
                name="whatsapp"
                type="text"
                inputMode="numeric"
                value={newWhatsapp}
                disabled={isPending}
                onChange={(event) =>
                  setNewWhatsapp(
                    normalizeWhatsapp(event.target.value),
                  )
                }
                placeholder="Contoh: 6281234567890"
                className="h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" />
              {isPending ? "Menyimpan..." : "Tambah PR"}
            </Button>
          </div>
        </form>

        {/* =========================================================
            DAFTAR PR
        ========================================================== */}
        <div className="space-y-3">
          <div>
            <h3 className="font-black">Daftar Public Relation</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Total PR: {region.publicRelations.length}
            </p>
          </div>

          {region.publicRelations.length > 0 ? (
            <div className="space-y-3">
              {region.publicRelations.map((publicRelation) => {
                const isEditing =
                  editablePublicRelation?.id === publicRelation.id;

                if (isEditing && editablePublicRelation) {
                  return (
                    <form
                      key={publicRelation.id}
                      action={handleUpdate}
                      className="space-y-3 rounded-2xl border border-red-100 bg-white p-4"
                    >
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          name="name"
                          value={editablePublicRelation.name}
                          disabled={isPending}
                          onChange={(event) =>
                            setEditablePublicRelation({
                              ...editablePublicRelation,
                              name: event.target.value,
                            })
                          }
                          className="h-10 rounded-md border px-3 text-sm outline-none focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100"
                          required
                        />

                        <input
                          name="whatsapp"
                          inputMode="numeric"
                          value={editablePublicRelation.whatsapp}
                          disabled={isPending}
                          onChange={(event) =>
                            setEditablePublicRelation({
                              ...editablePublicRelation,
                              whatsapp: normalizeWhatsapp(
                                event.target.value,
                              ),
                            })
                          }
                          className="h-10 rounded-md border px-3 text-sm outline-none focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isPending}
                          onClick={() =>
                            setEditablePublicRelation(null)
                          }
                        >
                          Batal
                        </Button>

                        <Button type="submit" disabled={isPending}>
                          Simpan Perubahan
                        </Button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={publicRelation.id}
                    className="flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black">
                          {publicRelation.name}
                        </p>

                        <span
                          className={[
                            "rounded-full px-2 py-0.5 text-[10px] font-black",
                            publicRelation.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-zinc-100 text-zinc-500",
                          ].join(" ")}
                        >
                          {publicRelation.isActive
                            ? "Aktif"
                            : "Nonaktif"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {publicRelation.whatsapp}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Sudah menerima {publicRelation.assignmentCount}{" "}
                        assignment
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          setEditablePublicRelation({
                            id: publicRelation.id,
                            name: publicRelation.name,
                            whatsapp: publicRelation.whatsapp,
                          })
                        }
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          handleToggle(publicRelation.id)
                        }
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {publicRelation.isActive
                          ? "Nonaktifkan"
                          : "Aktifkan"}
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          handleDelete(publicRelation.id)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Belum ada Public Relation pada wilayah ini.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}