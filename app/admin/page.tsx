import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [kostCount, publishedKostCount, draftKostCount, regionCount, facilityCount] =
    await Promise.all([
      prisma.kost.count(),
      prisma.kost.count({
        where: {
          status: "PUBLISHED",
        },
      }),
      prisma.kost.count({
        where: {
          status: "DRAFT",
        },
      }),
      prisma.region.count(),
      prisma.facility.count(),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Ringkasan data aplikasi informasi kost.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total Kost</p>
          <p className="mt-2 text-3xl font-bold">{kostCount}</p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="mt-2 text-3xl font-bold">{publishedKostCount}</p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Draft</p>
          <p className="mt-2 text-3xl font-bold">{draftKostCount}</p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Wilayah</p>
          <p className="mt-2 text-3xl font-bold">{regionCount}</p>
        </div>

        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Fasilitas</p>
          <p className="mt-2 text-3xl font-bold">{facilityCount}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-5 shadow-sm">
        <h3 className="font-semibold">Tahap berikutnya</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Setelah auth berhasil, lanjutkan membuat CRUD wilayah, CRUD fasilitas,
          lalu CRUD kost.
        </p>
      </div>
    </div>
  );
}