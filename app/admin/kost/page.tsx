import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import { deleteKostAction } from "@/features/kost/actions";
import KostModal from "@/features/kost/kost-modal";
import ImageManagerModal from "@/features/kost-image/image-manager-modal";
import { prisma } from "@/lib/prisma";

function formatRupiah(value: number) {
  return `Rp${value.toLocaleString("id-ID")}`;
}

function getPriceLabel(type: string) {
  if (type === "MONTHLY") {
    return "1 Bulan";
  }

  if (type === "SIX_MONTHS") {
    return "6 Bulan";
  }

  return "1 Tahun";
}

function formatStatus(status: string) {
  if (status === "PUBLISHED") {
    return "Published";
  }

  if (status === "ARCHIVED") {
    return "Archived";
  }

  return "Draft";
}

function getStatusClassName(status: string) {
  if (status === "PUBLISHED") {
    return "bg-green-100 text-green-700";
  }

  if (status === "ARCHIVED") {
    return "bg-zinc-100 text-zinc-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

function getGenderLabel(genderType: string | null) {
  if (genderType === "PUTRA") {
    return "Putra";
  }

  if (genderType === "PUTRI") {
    return "Putri";
  }

  if (genderType === "CAMPUR") {
    return "Campur";
  }

  return "Tidak ditentukan";
}

function getGenderClassName(genderType: string | null) {
  if (genderType === "PUTRA") {
    return "bg-blue-100 text-blue-700";
  }

  if (genderType === "PUTRI") {
    return "bg-pink-100 text-pink-700";
  }

  if (genderType === "CAMPUR") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-muted text-muted-foreground";
}

type AdminKostPageProps = {
  searchParams?: Promise<{
    q?: string;
    regionId?: string;
    genderType?: string;
    status?: string;
  }>;
};

export default async function AdminKostPage({
  searchParams,
}: AdminKostPageProps) {
  const params = await searchParams;

  const q = params?.q?.trim() ?? "";
  const regionId = params?.regionId ?? "";
  const genderType = params?.genderType ?? "";
  const status = params?.status ?? "";

  const [kosts, regions, facilities] = await Promise.all([
    prisma.kost.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  {
                    name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    contactWhatsapp: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},
          regionId ? { regionId } : {},
          genderType ? { genderType: genderType as any } : {},
          status ? { status: status as any } : {},
        ],
      },
      include: {
        region: true,
        prices: {
          orderBy: {
            type: "asc",
          },
        },
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        facilities: {
          include: {
            facility: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
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

  const hasActiveFilter = q || regionId || genderType || status;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Kost</h2>
          <p className="text-sm text-muted-foreground">
            Kelola informasi kost, wilayah, fasilitas, harga, foto, dan status
            publikasi.
          </p>
        </div>

        <KostModal mode="create" regions={regions} facilities={facilities} />
      </div>

      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <form
          action="/admin/kost"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]"
        >
          <div className="space-y-1">
            <label htmlFor="q" className="text-xs font-medium">
              Search
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Cari nama kost, WhatsApp, deskripsi..."
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="regionId" className="text-xs font-medium">
              Wilayah
            </label>
            <select
              id="regionId"
              name="regionId"
              defaultValue={regionId}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Semua wilayah</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="genderType" className="text-xs font-medium">
              Tipe
            </label>
            <select
              id="genderType"
              name="genderType"
              defaultValue={genderType}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Semua tipe</option>
              <option value="PUTRA">Putra</option>
              <option value="PUTRI">Putri</option>
              <option value="CAMPUR">Campur</option>
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="status" className="text-xs font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Semua status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
               <button
              type="submit"
              className="h-10 btn btn-sm rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/90"
            >
              Terapkan
            </button>
           

            {hasActiveFilter && (
              <a
                href="/admin/kost"
                className="flex h-10 items-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
              >
                Reset
              </a>
            )}
          </div>
        </form>

        {hasActiveFilter && (
          <div className="mt-4 flex flex-wrap gap-2">
            {q && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                Search: {q}
              </span>
            )}

            {regionId && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                Wilayah:{" "}
                {regions.find((region) => region.id === regionId)?.name ??
                  "Dipilih"}
              </span>
            )}

            {genderType && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                Tipe: {getGenderLabel(genderType)}
              </span>
            )}

            {status && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs">
                Status: {formatStatus(status)}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
        <table className="min-w-280 w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Kost</th>
              <th className="px-4 py-3 text-left">Wilayah</th>
              <th className="px-4 py-3 text-center">Tipe</th>
              <th className="px-4 py-3 text-center">Harga</th>
              <th className="px-4 py-3 text-center">Foto</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {kosts.map((kost, index) => {
              const monthlyPrice =
                kost.prices.find((price) => price.type === "MONTHLY")?.price ??
                null;

              const sixMonthPrice =
                kost.prices.find((price) => price.type === "SIX_MONTHS")
                  ?.price ?? null;

              const yearlyPrice =
                kost.prices.find((price) => price.type === "YEARLY")?.price ??
                null;

              return (
                <tr key={kost.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{index + 1}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{kost.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {kost.contactWhatsapp}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-left font-medium">
                    {kost.region.name}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={[
                        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                        getGenderClassName(kost.genderType),
                      ].join(" ")}
                    >
                      {getGenderLabel(kost.genderType)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {kost.prices.length > 0 ? (
                      <div className="inline-flex flex-col gap-1 text-left">
                        {kost.prices.map((price) => (
                          <div
                            key={price.id}
                            className="rounded-md bg-muted px-2 py-1 text-xs"
                          >
                            <span className="font-medium">
                              {getPriceLabel(price.type)}
                            </span>
                            : {formatRupiah(price.price)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <ImageManagerModal
                      kost={{
                        id: kost.id,
                        name: kost.name,
                        images: kost.images,
                      }}
                    />
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={[
                        "inline-flex rounded-full px-2 py-1 text-xs font-medium",
                        getStatusClassName(kost.status),
                      ].join(" ")}
                    >
                      {formatStatus(kost.status)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <KostModal
                        mode="edit"
                        regions={regions}
                        facilities={facilities}
                        kost={{
                          id: kost.id,
                          name: kost.name,
                          description: kost.description,
                          contactWhatsapp: kost.contactWhatsapp,

                          monthlyPrice,
                          sixMonthPrice,
                          yearlyPrice,

                          roomSize: kost.roomSize,
                          distanceToCampusInMeters:
                            kost.distanceToCampusInMeters,
                          googleMapsUrl: kost.googleMapsUrl,
                          genderType: kost.genderType,
                          waterFeeType: kost.waterFeeType,
                          electricityType: kost.electricityType,
                          status: kost.status,
                          isFeatured: kost.isFeatured,
                          regionId: kost.regionId,
                          facilityIds: kost.facilities.map(
                            (item) => item.facilityId
                          ),
                        }}
                      />

                      <DeleteConfirmDialog
                        title="Hapus kost?"
                        description={`Kost "${kost.name}" akan dihapus. Data yang sudah dihapus tidak dapat dikembalikan.`}
                        action={deleteKostAction.bind(null, kost.id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {kosts.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {hasActiveFilter
                    ? "Tidak ada data kost yang sesuai dengan filter."
                    : "Belum ada data kost."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}