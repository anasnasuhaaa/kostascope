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

import { createKostAction, updateKostAction } from "@/features/kost/actions";

type RegionOption = {
  id: string;
  name: string;
};

type FacilityOption = {
  id: string;
  name: string;
};

type KostModalProps = {
  mode: "create" | "edit";
  regions: RegionOption[];
  facilities: FacilityOption[];
  kost?: {
    id: string;
    name: string;
    description: string | null;
    contactWhatsapp: string;

    monthlyPrice: number | null;
    sixMonthPrice: number | null;
    yearlyPrice: number | null;

    roomSize: string | null;
    distanceToCampusInMeters: number | null;
    googleMapsUrl: string | null;
    genderType: "PUTRA" | "PUTRI" | "CAMPUR" | null;
    waterFeeType: "INCLUDED" | "NOT_INCLUDED";
    electricityType: "INCLUDED" | "TOKEN" | "SEPARATE";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    isFeatured: boolean;
    regionId: string;
    facilityIds: string[];
  };
};

function RequiredLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}

export default function KostModal({
  mode,
  regions,
  facilities,
  kost,
}: KostModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === "edit";
  const selectedFacilityIds = new Set(kost?.facilityIds ?? []);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        isEdit && kost
          ? await updateKostAction(kost.id, formData)
          : await createKostAction(formData);

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
          <Button>Tambah Kost</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Kost" : "Tambah Kost"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah informasi data kost."
              : "Tambahkan data kost baru ke sistem."}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Informasi Utama</h3>
              <p className="text-xs text-muted-foreground">
                Data dasar yang wajib ditampilkan pada informasi kost.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel htmlFor={`name-${kost?.id ?? "create"}`}>
                  Nama Kost
                </RequiredLabel>
                <Input
                  id={`name-${kost?.id ?? "create"}`}
                  name="name"
                  required
                  minLength={3}
                  defaultValue={kost?.name ?? ""}
                  placeholder="Contoh: Kost Putri Melati"
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel
                  htmlFor={`contactWhatsapp-${kost?.id ?? "create"}`}
                >
                  WhatsApp Narahubung
                </RequiredLabel>
                <Input
                  id={`contactWhatsapp-${kost?.id ?? "create"}`}
                  name="contactWhatsapp"
                  required
                  defaultValue={kost?.contactWhatsapp ?? ""}
                  placeholder="Contoh: 6281234567890"
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor={`regionId-${kost?.id ?? "create"}`}>
                  Wilayah
                </RequiredLabel>
                <select
                  id={`regionId-${kost?.id ?? "create"}`}
                  name="regionId"
                  required
                  defaultValue={kost?.regionId ?? ""}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="" disabled>
                    Pilih wilayah
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`genderType-${kost?.id ?? "create"}`}>
                  Tipe Penghuni
                </Label>
                <select
                  id={`genderType-${kost?.id ?? "create"}`}
                  name="genderType"
                  defaultValue={kost?.genderType ?? ""}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="PUTRI">Putri</option>
                  <option value="PUTRA">Putra</option>
                  <option value="CAMPUR">Campur</option>
                </select>
              </div>

              <div className="space-y-2">
                <RequiredLabel htmlFor={`status-${kost?.id ?? "create"}`}>
                  Status
                </RequiredLabel>
                <select
                  id={`status-${kost?.id ?? "create"}`}
                  name="status"
                  required
                  defaultValue={kost?.status ?? "DRAFT"}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">
                Harga Sewa <span className="text-red-500">*</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Isi minimal salah satu harga: per bulan, per 6 bulan, atau per
                tahun.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`monthlyPrice-${kost?.id ?? "create"}`}>
                  Harga Per Bulan
                </Label>
                <Input
                  id={`monthlyPrice-${kost?.id ?? "create"}`}
                  name="monthlyPrice"
                  type="number"
                  min={0}
                  defaultValue={kost?.monthlyPrice ?? ""}
                  placeholder="Contoh: 850000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`sixMonthPrice-${kost?.id ?? "create"}`}>
                  Harga Per 6 Bulan
                </Label>
                <Input
                  id={`sixMonthPrice-${kost?.id ?? "create"}`}
                  name="sixMonthPrice"
                  type="number"
                  min={0}
                  defaultValue={kost?.sixMonthPrice ?? ""}
                  placeholder="Contoh: 4800000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`yearlyPrice-${kost?.id ?? "create"}`}>
                  Harga Per Tahun
                </Label>
                <Input
                  id={`yearlyPrice-${kost?.id ?? "create"}`}
                  name="yearlyPrice"
                  type="number"
                  min={0}
                  defaultValue={kost?.yearlyPrice ?? ""}
                  placeholder="Contoh: 9000000"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Detail Kamar dan Biaya</h3>
              <p className="text-xs text-muted-foreground">
                Informasi tambahan mengenai kamar, jarak, air, dan listrik.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`roomSize-${kost?.id ?? "create"}`}>
                  Ukuran Kamar
                </Label>
                <Input
                  id={`roomSize-${kost?.id ?? "create"}`}
                  name="roomSize"
                  defaultValue={kost?.roomSize ?? ""}
                  placeholder="Contoh: 3m x 3m"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`distanceToCampusInMeters-${kost?.id ?? "create"}`}
                >
                  Jarak ke Kampus Meter
                </Label>
                <Input
                  id={`distanceToCampusInMeters-${kost?.id ?? "create"}`}
                  name="distanceToCampusInMeters"
                  type="number"
                  min={0}
                  defaultValue={kost?.distanceToCampusInMeters ?? ""}
                  placeholder="Contoh: 500"
                />
              </div>

              <div className="space-y-2">
                <RequiredLabel
                  htmlFor={`waterFeeType-${kost?.id ?? "create"}`}
                >
                  Biaya Air
                </RequiredLabel>
                <select
                  id={`waterFeeType-${kost?.id ?? "create"}`}
                  name="waterFeeType"
                  required
                  defaultValue={kost?.waterFeeType ?? "INCLUDED"}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="INCLUDED">Sudah Termasuk</option>
                  <option value="NOT_INCLUDED">Belum Termasuk</option>
                </select>
              </div>

              <div className="space-y-2">
                <RequiredLabel
                  htmlFor={`electricityType-${kost?.id ?? "create"}`}
                >
                  Listrik
                </RequiredLabel>
                <select
                  id={`electricityType-${kost?.id ?? "create"}`}
                  name="electricityType"
                  required
                  defaultValue={kost?.electricityType ?? "TOKEN"}
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="INCLUDED">Sudah Termasuk</option>
                  <option value="TOKEN">Token</option>
                  <option value="SEPARATE">Terpisah dari Harga Kost</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Deskripsi dan Lokasi</h3>
              <p className="text-xs text-muted-foreground">
                Tambahkan deskripsi dan link Google Maps jika tersedia.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor={`googleMapsUrl-${kost?.id ?? "create"}`}>
                  Link Google Maps
                </Label>
                <Input
                  id={`googleMapsUrl-${kost?.id ?? "create"}`}
                  name="googleMapsUrl"
                  type="url"
                  defaultValue={kost?.googleMapsUrl ?? ""}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${kost?.id ?? "create"}`}>
                  Deskripsi
                </Label>
                <textarea
                  id={`description-${kost?.id ?? "create"}`}
                  name="description"
                  defaultValue={kost?.description ?? ""}
                  rows={4}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tulis deskripsi singkat kost..."
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Fasilitas</h3>
              <p className="text-xs text-muted-foreground">
                Pilih fasilitas yang tersedia di kost.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {facilities.map((facility) => (
                <label
                  key={facility.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    name="facilityIds"
                    value={facility.id}
                    defaultChecked={selectedFacilityIds.has(facility.id)}
                  />
                  <span>{facility.name}</span>
                </label>
              ))}
            </div>

            {facilities.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Belum ada fasilitas. Tambahkan fasilitas terlebih dahulu.
              </p>
            )}
          </section>

          <section className="rounded-xl border p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={kost?.isFeatured ?? false}
              />
              <span className="text-sm font-medium">
                Tampilkan sebagai kost unggulan
              </span>
            </label>
          </section>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-col-reverse gap-2 border-t bg-background px-6 py-4 sm:flex-row sm:justify-end">
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