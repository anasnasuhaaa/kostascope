import Link from "next/link";

import KostForm from "@/features/kost/kost-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CreateKostPage() {
  const [regions, facilities] = await Promise.all([
    prisma.region.findMany({
      orderBy: {
        name: "asc",
      },
    }),

    prisma.facility.findMany({
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tambah Kost</h2>
          <p className="text-sm text-muted-foreground">
            Lengkapi informasi kost, harga sewa, fasilitas, dan status
            publikasi.
          </p>
        </div>

        <Link
          href="/admin/kost"
          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition hover:bg-muted"
        >
          Kembali
        </Link>
      </div>

      <KostForm mode="create" regions={regions} facilities={facilities} />
    </div>
  );
}