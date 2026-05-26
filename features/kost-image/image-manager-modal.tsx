"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
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

import {
  deleteKostImageAction,
  uploadKostImagesAction,
} from "@/features/kost-image/actions";

type KostImage = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

type ImageManagerModalProps = {
  kost: {
    id: string;
    name: string;
    images: KostImage[];
  };
};

export default function ImageManagerModal({ kost }: ImageManagerModalProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleUpload(formData: FormData) {
    startTransition(async () => {
      const result = await uploadKostImagesAction(kost.id, formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      formRef.current?.reset();
      router.refresh();
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      const result = await deleteKostImageAction(imageId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Kelola Foto ({kost.images.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Foto {kost.name}</DialogTitle>
          <DialogDescription>
            Upload, lihat, dan hapus foto untuk data kost ini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <form
            ref={formRef}
            action={handleUpload}
            className="space-y-4 rounded-xl border p-4"
          >
            <div>
              <h3 className="font-semibold">Upload Foto</h3>
              <p className="text-xs text-muted-foreground">
                Format yang didukung: JPG, PNG, WebP. Maksimal 4MB per gambar.
              </p>
            </div>

            <input
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black/80"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Mengupload..." : "Upload Foto"}
              </Button>
            </div>
          </form>

          <div className="space-y-4 rounded-xl border p-4">
            <div>
              <h3 className="font-semibold">Daftar Foto</h3>
              <p className="text-xs text-muted-foreground">
                Total foto: {kost.images.length}
              </p>
            </div>

            {kost.images.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {kost.images.map((image) => (
                  <div
                    key={image.id}
                    className="overflow-hidden rounded-xl border bg-background"
                  >
                    <div className="relative aspect-video bg-muted">
                      <Image
                        src={image.url}
                        alt={image.altText ?? kost.name}
                        unoptimized
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3">
                      <p className="truncate text-xs text-muted-foreground">
                        {image.url}
                      </p>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isPending}
                        onClick={() => handleDelete(image.id)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Belum ada foto untuk kost ini.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}