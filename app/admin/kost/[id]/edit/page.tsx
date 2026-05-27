import Link from "next/link";
import { notFound } from "next/navigation";

import KostForm from "@/features/kost/kost-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type EditKostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditKostPage({ params }: EditKostPageProps) {
  const { id } = await params;

  const [kost, regions, facilities] = await Promise.all([
    prisma.kost.findUnique({
      where: {
        id,
      },
      include: {
        prices: true,
        facilities: true,
      },
    }),

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

  if (!kost) {
    notFound();
  }

  const monthlyPrice =
    kost.prices.find((price) => price.type === "MONTHLY")?.price ?? null;

  const threeMonthPrice =
    kost.prices.find((price) => price.type === "THREE_MONTHS")?.price ?? null;

  const sixMonthPrice =
    kost.prices.find((price) => price.type === "SIX_MONTHS")?.price ?? null;

  const yearlyPrice =
    kost.prices.find((price) => price.type === "YEARLY")?.price ?? null;

  return (
    <div className="mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Kost</h2>
          <p className="text-sm text-muted-foreground">
            Ubah informasi kost {kost.name}.
          </p>
        </div>

        <Link
          href="/admin/kost"
          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
        >
          Kembali
        </Link>
      </div>

      <KostForm
        mode="edit"
        regions={regions}
        facilities={facilities}
        kost={{
          id: kost.id,
          name: kost.name,
          description: kost.description,
          contactWhatsapp: kost.contactWhatsapp,
          monthlyPrice,
          threeMonthPrice,
          sixMonthPrice,
          yearlyPrice,
          roomSize: kost.roomSize,
          distanceToCampusInMeters: kost.distanceToCampusInMeters,
          googleMapsUrl: kost.googleMapsUrl,
          genderType: kost.genderType,
          waterFeeType: kost.waterFeeType,
          electricityType: kost.electricityType,
          status: kost.status,
          isFeatured: kost.isFeatured,
          regionId: kost.regionId,
          facilityIds: kost.facilities.map((item) => item.facilityId),
        }}
      />
    </div>
  );
}