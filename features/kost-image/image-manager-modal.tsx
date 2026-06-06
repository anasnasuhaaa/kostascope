"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB per gambar
const MAX_TOTAL_UPLOAD_SIZE = 20 * 1024 * 1024; // 20 MB per upload
const MAX_FILES_PER_UPLOAD = 5;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatFileSize(sizeInBytes: number) {
  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
}

function validateSelectedFiles(files: FileList | null) {
  if (!files || files.length === 0) {
    return "Pilih minimal satu gambar";
  }

  if (files.length > MAX_FILES_PER_UPLOAD) {
    return `Maksimal ${MAX_FILES_PER_UPLOAD} gambar dalam satu kali upload`;
  }

  const selectedFiles = Array.from(files);

  const unsupportedFile = selectedFiles.find(
    (file) => !ALLOWED_IMAGE_TYPES.includes(file.type),
  );

  if (unsupportedFile) {
    return `Format ${unsupportedFile.name} tidak didukung. Gunakan JPG, PNG, atau WebP`;
  }

  const oversizedFile = selectedFiles.find(
    (file) => file.size > MAX_FILE_SIZE,
  );

  if (oversizedFile) {
    return `Ukuran ${oversizedFile.name} melebihi batas maksimal 4MB`;
  }

  const totalSize = selectedFiles.reduce(
    (total, file) => total + file.size,
    0,
  );

  if (totalSize > MAX_TOTAL_UPLOAD_SIZE) {
    return "Total ukuran gambar dalam satu kali upload maksimal 20MB";
  }

  return null;
}

export default function ImageManagerModal({
  kost,
}: ImageManagerModalProps) {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  function resetUploadForm() {
    formRef.current?.reset();
    setSelectedFiles([]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      setSelectedFiles([]);
      return;
    }

    const validationMessage = validateSelectedFiles(files);

    if (validationMessage) {
      toast.error(validationMessage);

      event.target.value = "";
      setSelectedFiles([]);

      return;
    }

    setSelectedFiles(Array.from(files));
  }

  function handleUpload(formData: FormData) {
    const files = inputRef.current?.files ?? null;
    const validationMessage = validateSelectedFiles(files);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    startTransition(async () => {
      try {
        const result = await uploadKostImagesAction(kost.id, formData);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);

        resetUploadForm();
        router.refresh();
      } catch (error) {
        console.error("UPLOAD_KOST_IMAGE_CLIENT_ERROR", error);

        toast.error(
          "Upload gagal diproses. Silakan coba kembali atau periksa koneksi server.",
        );
      }
    });
  }

  function handleDelete(imageId: string) {
    startTransition(async () => {
      try {
        const result = await deleteKostImageAction(imageId);

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.refresh();
      } catch (error) {
        console.error("DELETE_KOST_IMAGE_CLIENT_ERROR", error);

        toast.error("Gambar gagal dihapus. Silakan coba kembali.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetUploadForm();
        }
      }}
    >
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
                Format: JPG, PNG, atau WebP. Maksimal 4MB per gambar, maksimal 5
                gambar per upload, dan total maksimal 20MB.
              </p>
            </div>

            <input
              ref={inputRef}
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isPending}
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {selectedFiles.length > 0 && (
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">
                  {selectedFiles.length} gambar siap diupload
                </p>

                <ul className="mt-2 space-y-1">
                  {selectedFiles.map((file) => (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between gap-3 text-xs text-muted-foreground"
                    >
                      <span className="truncate">{file.name}</span>
                      <span className="shrink-0">
                        {formatFileSize(file.size)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isPending || selectedFiles.length === 0}
              >
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