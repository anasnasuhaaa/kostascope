import Link from "next/link";

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

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "..."> = [1];

  if (currentPage > 4) {
    items.push("...");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    items.push(page);
  }

  if (currentPage < totalPages - 3) {
    items.push("...");
  }

  items.push(totalPages);

  return items;
}

type AdminKostPageProps = {
  searchParams?: Promise<{
    q?: string;
    regionId?: string;
    genderType?: string;
    status?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
  }>;
};

export default async function AdminKostPage({
  searchParams,
}: AdminKostPageProps) {
  const params = await searchParams;

  const q = params?.q?.trim() ?? "";
  const effectiveQ = q.length >= 3 ? q : "";

  const regionId = params?.regionId ?? "";
  const genderType = params?.genderType ?? "";
  const status = params?.status ?? "";
  const sort = params?.sort ?? "newest";

  const page = clampNumber(Number(params?.page ?? 1) || 1, 1, 999999);
  const pageSize = clampNumber(Number(params?.pageSize ?? 10) || 10, 5, 50);
  const skip = (page - 1) * pageSize;

  const where = {
    AND: [
      effectiveQ
        ? {
            OR: [
              {
                name: {
                  contains: effectiveQ,
                  mode: "insensitive" as const,
                },
              },
              {
                contactWhatsapp: {
                  contains: effectiveQ,
                  mode: "insensitive" as const,
                },
              },
              {
                description: {
                  contains: effectiveQ,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {},
      regionId ? { regionId } : {},
      genderType ? { genderType: genderType as any } : {},
      status ? { status: status as any } : {},
    ],
  };

  const orderBy =
    sort === "name_asc"
      ? { name: "asc" as const }
      : sort === "name_desc"
        ? { name: "desc" as const }
        : sort === "oldest"
          ? { createdAt: "asc" as const }
          : { createdAt: "desc" as const };

  const [kosts, totalKosts, regions, facilities] = await Promise.all([
    prisma.kost.findMany({
      where,
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
      orderBy,
      skip,
      take: pageSize,
    }),

    prisma.kost.count({
      where,
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

  const totalPages = Math.max(1, Math.ceil(totalKosts / pageSize));
  const currentPage = Math.min(page, totalPages);
  const firstItem = totalKosts === 0 ? 0 : skip + 1;
  const lastItem = Math.min(skip + kosts.length, totalKosts);

  const hasActiveFilter = Boolean(
    effectiveQ || regionId || genderType || status || sort !== "newest"
  );

  function createHref(overrides: Record<string, string | number | null>) {
    const search = new URLSearchParams();

    if (q) {
      search.set("q", q);
    }

    if (regionId) {
      search.set("regionId", regionId);
    }

    if (genderType) {
      search.set("genderType", genderType);
    }

    if (status) {
      search.set("status", status);
    }

    if (sort && sort !== "newest") {
      search.set("sort", sort);
    }

    if (pageSize !== 10) {
      search.set("pageSize", String(pageSize));
    }

    for (const [key, value] of Object.entries(overrides)) {
      if (value === null || value === "" || value === undefined) {
        search.delete(key);
      } else {
        search.set(key, String(value));
      }
    }

    const query = search.toString();

    return query ? `/admin/kost?${query}` : "/admin/kost";
  }

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

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="border-b bg-muted/20 p-4">
          <form
            action="/admin/kost"
            className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_0.8fr_auto]"
          >
            <div className="space-y-1">
              <label htmlFor="q" className="text-xs font-medium">
                Search
              </label>
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Minimal 3 huruf..."
                className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-black"
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
                className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-black"
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
                className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-black"
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
                className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Semua status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="sort" className="text-xs font-medium">
                Sort
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={sort}
                className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-black"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name_asc">Nama A-Z</option>
                <option value="name_desc">Nama Z-A</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="pageSize" className="text-xs font-medium">
                Rows
              </label>
              <select
                id="pageSize"
                name="pageSize"
                defaultValue={pageSize}
                className="h-9 w-full rounded-md border bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-black"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <input type="hidden" name="page" value="1" />

              <button
                type="submit"
                className="h-9 rounded-md bg-black px-4 text-xs font-medium text-white hover:bg-black/90"
              >
                Filter
              </button>

              {hasActiveFilter && (
                <Link
                  href="/admin/kost"
                  className="flex h-9 items-center rounded-md border px-4 text-xs font-medium hover:bg-muted"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>

          <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Menampilkan{" "}
              <span className="font-semibold text-foreground">{firstItem}</span>{" "}
              -{" "}
              <span className="font-semibold text-foreground">{lastItem}</span>{" "}
              dari{" "}
              <span className="font-semibold text-foreground">
                {totalKosts}
              </span>{" "}
              data
            </p>

            {q.length > 0 && q.length < 3 && (
              <p className="text-yellow-600">
                Search aktif setelah minimal 3 huruf.
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
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
                  kost.prices.find((price) => price.type === "MONTHLY")
                    ?.price ?? null;

                const sixMonthPrice =
                  kost.prices.find((price) => price.type === "SIX_MONTHS")
                    ?.price ?? null;

                const yearlyPrice =
                  kost.prices.find((price) => price.type === "YEARLY")
                    ?.price ?? null;

                return (
                  <tr key={kost.id} className="border-t">
                    <td className="px-4 py-3 font-medium">
                      {skip + index + 1}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {kost.name}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {kost.contactWhatsapp}
                          </div>

                          {kost.isFeatured && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-[#BE1E2D] ring-1 ring-red-100">
                                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#BE1E2D] text-[8px] text-white">
                                  ✓
                                </span>
                                Kost Rekomendasi
                              </span>
                            </div>
                          )}
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
                    className="px-4 py-10 text-center text-muted-foreground"
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

        <div className="flex flex-col gap-3 border-t bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Page{" "}
            <span className="font-semibold text-foreground">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={createHref({
                page: Math.max(1, currentPage - 1),
              })}
              aria-disabled={currentPage <= 1}
              className={[
                "flex h-9 items-center rounded-md border px-3 text-xs font-medium",
                currentPage <= 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-background",
              ].join(" ")}
            >
              Prev
            </Link>

            {getPaginationItems(currentPage, totalPages).map((item, index) =>
              item === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 items-center px-2 text-xs text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Link
                  key={item}
                  href={createHref({
                    page: item,
                  })}
                  className={[
                    "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-xs font-medium",
                    item === currentPage
                      ? "border-black bg-black text-white"
                      : "hover:bg-background",
                  ].join(" ")}
                >
                  {item}
                </Link>
              )
            )}

            <Link
              href={createHref({
                page: Math.min(totalPages, currentPage + 1),
              })}
              aria-disabled={currentPage >= totalPages}
              className={[
                "flex h-9 items-center rounded-md border px-3 text-xs font-medium",
                currentPage >= totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-background",
              ].join(" ")}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}