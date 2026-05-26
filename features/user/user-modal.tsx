"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createUserAction, updateUserAction } from "@/features/user/actions";

type UserModalProps = {
  mode: "create" | "edit";
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: "ADMIN" | "SUPER_ADMIN";
  };
};

export default function UserModal({ mode, user }: UserModalProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = mode === "edit";

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        isEdit && user
          ? await updateUserAction(user.id, formData)
          : await createUserAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button>Tambah User</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Tambah User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Ubah data user admin. Kosongkan password jika tidak ingin mengubahnya."
              : "Tambahkan user baru untuk mengakses admin panel."}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor={`name-${user?.id ?? "create"}`}
              className="text-sm font-medium"
            >
              Nama <span className="text-red-500">*</span>
            </label>
            <Input
              id={`name-${user?.id ?? "create"}`}
              name="name"
              required
              minLength={2}
              defaultValue={user?.name ?? ""}
              placeholder="Contoh: Admin Kostascope"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`email-${user?.id ?? "create"}`}
              className="text-sm font-medium"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              id={`email-${user?.id ?? "create"}`}
              name="email"
              type="email"
              required
              defaultValue={user?.email ?? ""}
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`password-${user?.id ?? "create"}`}
              className="text-sm font-medium"
            >
              Password {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <Input
              id={`password-${user?.id ?? "create"}`}
              name="password"
              type="password"
              required={!isEdit}
              minLength={isEdit ? undefined : 8}
              placeholder={
                isEdit
                  ? "Kosongkan jika tidak ingin mengubah password"
                  : "Minimal 8 karakter"
              }
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor={`role-${user?.id ?? "create"}`}
              className="text-sm font-medium"
            >
              Role <span className="text-red-500">*</span>
            </label>
            <select
              id={`role-${user?.id ?? "create"}`}
              name="role"
              required
              defaultValue={user?.role ?? "ADMIN"}
              className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}