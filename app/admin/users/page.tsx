import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import { deleteUserAction } from "@/features/user/actions";
import UserModal from "@/features/user/user-modal";
import { requireSuperAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

function formatRole(role: string) {
  if (role === "SUPER_ADMIN") {
    return "Super Admin";
  }

  return "Admin";
}

function getRoleClassName(role: string) {
  if (role === "SUPER_ADMIN") {
    return "bg-red-50 text-[#BE1E2D] ring-red-100";
  }

  return "bg-blue-50 text-blue-700 ring-blue-100";
}

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  const session = await requireSuperAdmin();

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manajemen User</h2>
          <p className="text-sm text-muted-foreground">
            Kelola akun admin yang dapat mengakses dashboard Kostascope.
          </p>
        </div>

        <UserModal mode="create" />
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
        <table className="min-w-215 w-full text-sm">
          <thead className="bg-muted/60">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Role</th>
              <th className="px-4 py-3 text-center">Dibuat</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3 font-medium">{index + 1}</td>

                <td className="px-4 py-3">
                  <div className="font-medium">{user.name ?? "-"}</div>

                  {session.user.id === user.id && (
                    <span className="mt-1 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Akun sedang digunakan
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-muted-foreground">
                  {user.email}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={[
                      "inline-flex rounded-full px-2 py-1 text-xs font-bold ring-1",
                      getRoleClassName(user.role),
                    ].join(" ")}
                  >
                    {formatRole(user.role)}
                  </span>
                </td>

                <td className="px-4 py-3 text-center text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <UserModal
                      mode="edit"
                      user={{
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                      }}
                    />

                    <DeleteConfirmDialog
                      title="Hapus user?"
                      description={`User "${user.email}" akan dihapus. Data yang sudah dihapus tidak dapat dikembalikan.`}
                      action={deleteUserAction.bind(null, user.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Belum ada user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}