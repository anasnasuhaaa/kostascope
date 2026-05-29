"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import DeleteConfirmDialog from "@/components/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteKostAction } from "@/features/kost/actions";

type KostActionMenuProps = {
  kost: {
    id: string;
    name: string;
  };
};

export default function KostActionMenu({ kost }: KostActionMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Buka aksi untuk ${kost.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/kost/${kost.id}`}
              className="flex cursor-pointer items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Detail
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/admin/kost/${kost.id}/edit`}
              className="flex cursor-pointer items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setDeleteDialogOpen(true);
            }}
            className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        trigger={null}
        title="Hapus kost?"
        description={`Kost "${kost.name}" akan dihapus. Data yang sudah dihapus tidak dapat dikembalikan.`}
        action={deleteKostAction.bind(null, kost.id)}
      />
    </>
  );
}