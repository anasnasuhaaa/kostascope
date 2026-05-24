import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import FacilityModal from "@/features/facility/facility-modal";
import { deleteFacilityAction } from "@/features/facility/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminFacilitiesPage() {
  const facilities = await prisma.facility.findMany({
    include: {
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fasilitas</h2>
          <p className="text-sm text-muted-foreground">
            Kelola daftar fasilitas kost seperti AC, Wifi, Kasur, dan CCTV.
          </p>
        </div>

        <FacilityModal mode="create" />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
        <table className="min-w-160 w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-center">Jumlah Kost</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {facilities.map((facility, index) => (
              <tr key={facility.id} className="border-t">
                <td className="px-4 py-3 font-medium">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{facility.name}</td>
                <td className="px-4 py-3 text-center">
                  {facility._count.kosts}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <FacilityModal
                      mode="edit"
                      facility={{
                        id: facility.id,
                        name: facility.name,
                      }}
                    />

                    <DeleteConfirmDialog
                      title="Hapus fasilitas?"
                      description={`Fasilitas "${facility.name}" akan dihapus. Data yang sudah dihapus tidak dapat dikembalikan.`}
                      action={deleteFacilityAction.bind(null, facility.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {facilities.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Belum ada fasilitas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}