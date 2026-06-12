import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import RegionPublicRelationModal from "@/features/region-public-relation/region-public-relation-modal";
import { deleteRegionAction } from "@/features/region/actions";
import RegionModal from "@/features/region/region-modal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminRegionsPage() {
  /**
   * Ambil daftar wilayah beserta:
   * - seluruh Public Relation pada setiap wilayah;
   * - jumlah kost pada setiap wilayah.
   */
  const regions = await prisma.region.findMany({
    include: {
      publicRelations: {
        orderBy: [
          {
            isActive: "desc",
          },
          {
            name: "asc",
          },
        ],
      },

      _count: {
        select: {
          kosts: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      {/* =========================================================
          HEADER HALAMAN
      ========================================================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Wilayah</h2>

          <p className="text-sm text-muted-foreground">
            Kelola wilayah kost dan daftar Public Relation yang bertanggung
            jawab pada setiap wilayah.
          </p>
        </div>

        <RegionModal mode="create" />
      </div>

      {/* =========================================================
          TABEL WILAYAH
      ========================================================== */}
      <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
        <table className="min-w-240 w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">#</th>

              <th className="px-4 py-3 text-left">
                Nama Wilayah
              </th>

              <th className="px-4 py-3 text-center">
                Jumlah PR
              </th>

              <th className="px-4 py-3 text-center">
                PR Aktif
              </th>

              <th className="px-4 py-3 text-center">
                Jumlah Kost
              </th>

              <th className="px-4 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {regions.map((region, index) => {
              /**
               * Hitung jumlah PR yang masih aktif.
               *
               * PR nonaktif tidak akan menerima pembagian
               * kontak WhatsApp dari pengguna.
               */
              const activePublicRelationCount =
                region.publicRelations.filter(
                  (publicRelation) => publicRelation.isActive,
                ).length;

              return (
                <tr key={region.id} className="border-t">
                  <td className="px-4 py-3 font-medium">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {region.name}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {region.publicRelations.length}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {activePublicRelationCount > 0 ? (
                      <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-green-100">
                        {activePublicRelationCount} aktif
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-[#BE1E2D] ring-1 ring-red-100">
                        Belum ada
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {region._count.kosts}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      {/*
                        Tombol untuk menambah, mengedit,
                        mengaktifkan, menonaktifkan, dan
                        menghapus Public Relation.
                      */}
                      <RegionPublicRelationModal
                        region={{
                          id: region.id,
                          name: region.name,

                          publicRelations:
                            region.publicRelations.map(
                              (publicRelation) => ({
                                id: publicRelation.id,
                                name: publicRelation.name,
                                whatsapp:
                                  publicRelation.whatsapp,
                                isActive:
                                  publicRelation.isActive,
                                assignmentCount:
                                  publicRelation.assignmentCount,
                              }),
                            ),
                        }}
                      />

                      {/*
                        Modal edit wilayah hanya mengatur
                        nama wilayah.
                      */}
                      <RegionModal
                        mode="edit"
                        region={{
                          id: region.id,
                          name: region.name,
                        }}
                      />

                      <DeleteConfirmDialog
                        title="Hapus wilayah?"
                        description={`Wilayah "${region.name}" akan dihapus. Data yang sudah dihapus tidak dapat dikembalikan.`}
                        action={deleteRegionAction.bind(
                          null,
                          region.id,
                        )}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {regions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Belum ada wilayah.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}