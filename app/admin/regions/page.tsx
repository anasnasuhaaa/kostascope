import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import RegionModal from "@/features/region/region-modal";
import { deleteRegionAction } from "@/features/region/actions";
import { prisma } from "@/lib/prisma";

export default async function AdminRegionsPage() {
  const regions = await prisma.region.findMany({
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
          <h2 className="text-2xl font-bold">Kelola Wilayah</h2>
        </div>

        <RegionModal mode="create" />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
        <table className="min-w-180 w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-center">Jumlah Kost</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {regions.map((region, index) => (
              <tr key={region.id} className="border-t">
                <td className="px-4 py-3 font-medium">{index +1}</td>
                <td className="px-4 py-3 font-medium">{region.name}</td>
                <td className="px-4 py-3 text-center">{region._count.kosts}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
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
                      action={deleteRegionAction.bind(null, region.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {regions.length === 0 && (
              <tr>
                <td
                  colSpan={4}
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