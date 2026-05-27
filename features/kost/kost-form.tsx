"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createKostAction, updateKostAction } from "@/features/kost/actions";

import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  ClipboardList,
  MapPinned,
  Sparkles,
  WalletCards,
} from "lucide-react";

type RegionOption = {
  id: string;
  name: string;
};

type FacilityOption = {
  id: string;
  name: string;
};

type FieldErrors = Record<string, string[] | undefined>;

type KostFormProps = {
  mode: "create" | "edit";
  regions: RegionOption[];
  facilities: FacilityOption[];
  kost?: {
    id: string;
    name: string;
    description: string | null;
    contactWhatsapp: string;

    monthlyPrice: number | null;
    threeMonthPrice: number | null;
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

function SectionTitle({
  icon: Icon,
  title,
  description,
  required = false,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  required?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-semibold">
          {title} {required && <span className="text-red-500">*</span>}
        </h3>

        <p className="text-xs text-muted-foreground">{description}</p>

        {children}
      </div>
    </div>
  );
}

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

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return <p className="text-xs font-medium text-red-600">{errors[0]}</p>;
}

function getInputClassName(hasError?: boolean) {
  return [
    hasError ? "border-red-500 focus-visible:ring-red-200" : "",
  ].join(" ");
}

export default function KostForm({
  mode,
  regions,
  facilities,
  kost,
}: KostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isEdit = mode === "edit";
  const selectedFacilityIds = new Set(kost?.facilityIds ?? []);
  const formId = kost?.id ?? "create";

  function handleSubmit(formData: FormData) {
    setFieldErrors({});

    startTransition(async () => {
      const result =
        isEdit && kost
          ? await updateKostAction(kost.id, formData)
          : await createKostAction(formData);

      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {});
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/admin/kost");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <section className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
        <SectionTitle
          icon={ClipboardList}
          title="Informasi Utama"
          description="Data dasar yang wajib ditampilkan pada informasi kost."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <RequiredLabel htmlFor={`name-${formId}`}>Nama Kost</RequiredLabel>
            <Input
              id={`name-${formId}`}
              name="name"
              defaultValue={kost?.name ?? ""}
              placeholder="Contoh: Kost Putri Melati"
              className={getInputClassName(Boolean(fieldErrors.name))}
            />
            <FieldError errors={fieldErrors.name} />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor={`contactWhatsapp-${formId}`}>
              WhatsApp Narahubung
            </RequiredLabel>
            <Input
              id={`contactWhatsapp-${formId}`}
              name="contactWhatsapp"
              defaultValue={kost?.contactWhatsapp ?? ""}
              placeholder="Contoh: 6281234567890"
              className={getInputClassName(
                Boolean(fieldErrors.contactWhatsapp)
              )}
            />
            <FieldError errors={fieldErrors.contactWhatsapp} />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor={`regionId-${formId}`}>
              Wilayah
            </RequiredLabel>
            <select
              id={`regionId-${formId}`}
              name="regionId"
              defaultValue={kost?.regionId ?? ""}
              className={[
                "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
                fieldErrors.regionId ? "border-red-500" : "",
              ].join(" ")}
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
            <FieldError errors={fieldErrors.regionId} />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor={`genderType-${formId}`}>
              Tipe Penghuni
            </RequiredLabel>
            <select
              id={`genderType-${formId}`}
              name="genderType"
              defaultValue={kost?.genderType ?? "PUTRI"}
              className={[
                "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
                fieldErrors.genderType ? "border-red-500" : "",
              ].join(" ")}
            >
              <option value="PUTRI">Putri</option>
              <option value="PUTRA">Putra</option>
              <option value="CAMPUR">Campur</option>
            </select>
            <FieldError errors={fieldErrors.genderType} />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor={`status-${formId}`}>Status</RequiredLabel>
            <select
              id={`status-${formId}`}
              name="status"
              defaultValue={kost?.status ?? "DRAFT"}
              className={[
                "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
                fieldErrors.status ? "border-red-500" : "",
              ].join(" ")}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            <FieldError errors={fieldErrors.status} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
        <SectionTitle
          icon={WalletCards}
          title="Harga Sewa"
          description="Isi minimal salah satu harga: per bulan, per 3 bulan, per 6 bulan, atau per tahun."
          required
        >
          <FieldError errors={fieldErrors.prices} />
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor={`monthlyPrice-${formId}`}>Harga Per Bulan</Label>
            <Input
              id={`monthlyPrice-${formId}`}
              name="monthlyPrice"
              type="number"
              min={0}
              defaultValue={kost?.monthlyPrice ?? ""}
              placeholder="Contoh: 850000"
              className={getInputClassName(Boolean(fieldErrors.monthlyPrice))}
            />
            <FieldError errors={fieldErrors.monthlyPrice} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`threeMonthPrice-${formId}`}>
              Harga Per 3 Bulan
            </Label>
            <Input
              id={`threeMonthPrice-${formId}`}
              name="threeMonthPrice"
              type="number"
              min={0}
              defaultValue={kost?.threeMonthPrice ?? ""}
              placeholder="Contoh: 2400000"
              className={getInputClassName(
                Boolean(fieldErrors.threeMonthPrice)
              )}
            />
            <FieldError errors={fieldErrors.threeMonthPrice} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`sixMonthPrice-${formId}`}>
              Harga Per 6 Bulan
            </Label>
            <Input
              id={`sixMonthPrice-${formId}`}
              name="sixMonthPrice"
              type="number"
              min={0}
              defaultValue={kost?.sixMonthPrice ?? ""}
              placeholder="Contoh: 4800000"
              className={getInputClassName(Boolean(fieldErrors.sixMonthPrice))}
            />
            <FieldError errors={fieldErrors.sixMonthPrice} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`yearlyPrice-${formId}`}>Harga Per Tahun</Label>
            <Input
              id={`yearlyPrice-${formId}`}
              name="yearlyPrice"
              type="number"
              min={0}
              defaultValue={kost?.yearlyPrice ?? ""}
              placeholder="Contoh: 9000000"
              className={getInputClassName(Boolean(fieldErrors.yearlyPrice))}
            />
            <FieldError errors={fieldErrors.yearlyPrice} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
        <SectionTitle
          icon={BedDouble}
          title="Detail Kamar dan Biaya"
          description="Informasi tambahan mengenai kamar, jarak, air, dan listrik."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`roomSize-${formId}`}>Ukuran Kamar</Label>
            <Input
              id={`roomSize-${formId}`}
              name="roomSize"
              defaultValue={kost?.roomSize ?? ""}
              placeholder="Contoh: 3m x 3m"
              className={getInputClassName(Boolean(fieldErrors.roomSize))}
            />
            <FieldError errors={fieldErrors.roomSize} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`distanceToCampusInMeters-${formId}`}>
              Jarak ke Kampus Meter
            </Label>
            <Input
              id={`distanceToCampusInMeters-${formId}`}
              name="distanceToCampusInMeters"
              type="number"
              min={0}
              defaultValue={kost?.distanceToCampusInMeters ?? ""}
              placeholder="Contoh: 500"
              className={getInputClassName(
                Boolean(fieldErrors.distanceToCampusInMeters)
              )}
            />
            <FieldError errors={fieldErrors.distanceToCampusInMeters} />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor={`waterFeeType-${formId}`}>
              Biaya Air
            </RequiredLabel>
            <select
              id={`waterFeeType-${formId}`}
              name="waterFeeType"
              defaultValue={kost?.waterFeeType ?? "INCLUDED"}
              className={[
                "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
                fieldErrors.waterFeeType ? "border-red-500" : "",
              ].join(" ")}
            >
              <option value="INCLUDED">Sudah Termasuk</option>
              <option value="NOT_INCLUDED">Belum Termasuk</option>
            </select>
            <FieldError errors={fieldErrors.waterFeeType} />
          </div>

          <div className="space-y-2">
            <RequiredLabel htmlFor={`electricityType-${formId}`}>
              Listrik
            </RequiredLabel>
            <select
              id={`electricityType-${formId}`}
              name="electricityType"
              defaultValue={kost?.electricityType ?? "TOKEN"}
              className={[
                "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm",
                fieldErrors.electricityType ? "border-red-500" : "",
              ].join(" ")}
            >
              <option value="INCLUDED">Sudah Termasuk</option>
              <option value="TOKEN">Token</option>
              <option value="SEPARATE">Terpisah dari Harga Kost</option>
            </select>
            <FieldError errors={fieldErrors.electricityType} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
        <SectionTitle
          icon={MapPinned}
          title="Deskripsi dan Lokasi"
          description="Tambahkan deskripsi dan link Google Maps jika tersedia."
        />

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor={`googleMapsUrl-${formId}`}>Link Google Maps</Label>
            <Input
              id={`googleMapsUrl-${formId}`}
              name="googleMapsUrl"
              defaultValue={kost?.googleMapsUrl ?? ""}
              placeholder="https://maps.google.com/..."
              className={getInputClassName(Boolean(fieldErrors.googleMapsUrl))}
            />
            <FieldError errors={fieldErrors.googleMapsUrl} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${formId}`}>Deskripsi</Label>
            <textarea
              id={`description-${formId}`}
              name="description"
              defaultValue={kost?.description ?? ""}
              rows={5}
              className={[
                "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black",
                fieldErrors.description ? "border-red-500" : "",
              ].join(" ")}
              placeholder="Tulis deskripsi singkat kost..."
            />
            <FieldError errors={fieldErrors.description} />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-background p-4 shadow-sm">
        <SectionTitle
          icon={Sparkles}
          title="Fasilitas"
          description="Pilih fasilitas yang tersedia di kost."
        />

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

      <section className="rounded-xl border bg-background p-4 shadow-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={kost?.isFeatured ?? false}
          />
          <span className="text-sm font-medium">
            Tampilkan sebagai kost rekomendasi
          </span>
        </label>
      </section>

      <div className="sticky bottom-0 z-20 flex flex-col-reverse gap-2 border-t bg-background/95 px-4 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isPending} asChild>
          <Link href="/admin/kost">Batal</Link>
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan Kost"}
        </Button>
      </div>
    </form>
  );
}