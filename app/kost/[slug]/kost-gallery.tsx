"use client";

import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type KostImage = {
  id: string;
  url: string;
  altText: string | null;
};

type KostGalleryProps = {
  kostName: string;
  images: KostImage[];
};

export default function KostGallery({ kostName, images }: KostGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<KostImage | null>(null);

  const mainImage = images[0];

  if (images.length == 0)  {
    return (
      <div className="overflow-hidden rounded-3xl border border-red-100 bg-white p-3 shadow-sm">
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-linear-to-br from-red-50 to-zinc-100">
          <div className="rounded-2xl bg-white px-6 py-4 text-lg font-black text-[#BE1E2D] shadow-sm">
            Kostascope
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-red-100 bg-white p-3 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
          <button
            type="button"
            onClick={() => setSelectedImage(mainImage)}
            className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-zinc-100"
          >
            <Image
              src={mainImage.url}
              alt={mainImage.altText ?? kostName}
              fill
              priority
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />

          </button>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {images.slice(1, 5).map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image)}
                className="group relative aspect-video overflow-hidden rounded-2xl bg-zinc-100"
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? kostName}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="300px"
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
              </button>
            ))}

            {images.length === 1 && (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-red-50 text-sm font-bold text-[#BE1E2D]">
                Kostascope
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null);
          }
        }}
      >
        <DialogContent className="max-h-[92vh] max-w-[calc(100vw-1rem)] overflow-hidden border-0 bg-transparent p-0 shadow-none sm:max-w-5xl">
          <DialogTitle className="sr-only">
            Preview foto {kostName}
          </DialogTitle>

          {selectedImage && (
            <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-2xl">
              <div className="relative aspect-4/3 max-h-[86vh] w-full overflow-hidden rounded-2xl bg-zinc-100 sm:aspect-16/10">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText ?? kostName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}