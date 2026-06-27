"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Crown,
  Search,
  UserRound,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type KostContactDialogProps = {
  slug: string;
  kostName: string;
  regionName: string;
  hasActivePublicRelation: boolean;
};

type ServiceStatus = {
  isAvailable: boolean;
  reason:
  | "AVAILABLE"
  | "DISABLED"
  | "OUTSIDE_SCHEDULE"
  | "NOT_CONFIGURED"
  | "ERROR";
  message: string;
};

export default function KostContactDialog({
  slug,
  kostName,
  regionName,
  hasActivePublicRelation,
}: KostContactDialogProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isChoiceOpen, setIsChoiceOpen] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isUnavailableOpen, setIsUnavailableOpen] =
    useState(false);

  const [unavailableMessage, setUnavailableMessage] =
    useState("");

  const [customerName, setCustomerName] = useState("");
  const [studyProgram, setStudyProgram] = useState("");
  const [cohort, setCohort] = useState("");

  /**
   * Cek status dan jam layanan sebelum menampilkan pilihan kontak.
   */
  async function handleOpenContact() {
    try {
      setIsChecking(true);

      const response = await fetch(
        "/api/contact-service/status",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const status =
        (await response.json()) as ServiceStatus;

      if (!response.ok) {
        throw new Error(
          status.message ||
          "Gagal memeriksa jam layanan",
        );
      }

      if (!status.isAvailable) {
        setUnavailableMessage(status.message);
        setIsUnavailableOpen(true);

        return;
      }

      setIsChoiceOpen(true);
    } catch (error) {
      console.error(
        "CONTACT_SERVICE_STATUS_ERROR",
        error,
      );

      setUnavailableMessage(
        error instanceof Error
          ? error.message
          : "Layanan WhatsApp belum dapat diakses. Silakan coba kembali beberapa saat lagi.",
      );

      setIsUnavailableOpen(true);
    } finally {
      setIsChecking(false);
    }
  }

  /**
   * Buka WhatsApp pemilik kost secara langsung.
   */
  function handleDirectContact() {
    setIsChoiceOpen(false);

    window.open(
      `/api/kost/${slug}/contact/direct`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  /**
   * Bersihkan form setelah request berhasil dikirim.
   *
   * Data Finder dikirim melalui POST body agar tidak muncul
   * sebagai query parameter pada address bar browser.
   */
  function handleFinderSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    const normalizedName = customerName.trim();
    const normalizedStudyProgram = studyProgram.trim();
    const normalizedCohort = cohort.trim();

    if (
      !normalizedName ||
      !normalizedStudyProgram ||
      !/^\d{2,4}$/.test(normalizedCohort)
    ) {
      event.preventDefault();
      return;
    }

    /**
     * Gunakan timeout agar browser sempat mengirim seluruh nilai
     * form sebelum state dikosongkan.
     */
    window.setTimeout(() => {
      setCustomerName("");
      setStudyProgram("");
      setCohort("");
      setIsFinderOpen(false);
      setIsChoiceOpen(false);
    }, 0);
  }

  function handleFinderDialogChange(open: boolean) {
    setIsFinderOpen(open);

    if (!open) {
      setCustomerName("");
      setStudyProgram("");
      setCohort("");
    }
  }

  return (
    <>
      {/* =========================================================
          TOMBOL UTAMA
      ========================================================== */}
      <button
        type="button"
        disabled={isChecking}
        onClick={handleOpenContact}
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] px-4 text-sm font-black text-white shadow-lg shadow-red-950/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#9F1725] hover:shadow-xl hover:shadow-red-950/15 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
      >
        <WhatsappLogo />

        <span>
          {isChecking
            ? "Memeriksa layanan..."
            : "Hubungi via WhatsApp"}
        </span>

        {!isChecking && (
          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
        )}
      </button>

      {/* =========================================================
    DIALOG PILIHAN KONTAK
========================================================== */}
      <Dialog
        open={isChoiceOpen}
        onOpenChange={setIsChoiceOpen}
      >
        <DialogContent className="max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-red-100 bg-[#FAFAFC] p-0 shadow-2xl shadow-red-950/10 sm:max-w-2xl sm:rounded-3xl">
          {/* Header */}
          <div className="border-b border-red-100 bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF] px-4 py-4 sm:px-6 sm:py-5">
            <DialogHeader>
              <DialogTitle className="pr-6 text-lg font-black tracking-tight text-zinc-950 sm:text-2xl">
                Pilih Cara Menghubungi Kost
              </DialogTitle>

              <DialogDescription className="max-w-xl text-xs leading-5 text-zinc-500 sm:text-sm sm:leading-6">
                Pilih layanan yang sesuai untuk mendapatkan informasi
                mengenai{" "}
                <span className="font-bold text-zinc-700">
                  {kostName}
                </span>
                .
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Card pilihan */}
          <div className="grid gap-3 p-3 sm:grid-cols-1 sm:gap-4 sm:p-6">
            {/* =====================================================
          OPSI MANDIRI
      ====================================================== */}

            <button
              type="button"
              onClick={handleDirectContact}
              className="group flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-white p-3.5 text-left shadow-sm transition duration-300 hover:border-red-200 hover:bg-red-50/40 hover:shadow-md sm:min-h-64 sm:flex-col sm:items-stretch sm:p-5"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 sm:w-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition duration-300 group-hover:bg-red-50 group-hover:text-[#BE1E2D] sm:h-11 sm:w-11 sm:rounded-2xl">
                  <UserRound className="h-5 w-5" />
                </div>

                <span className="hidden rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-500 sm:inline-flex">
                  Mandiri
                </span>
              </div>

              <div className="min-w-0 flex-1 sm:mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-black text-zinc-950 sm:text-base">
                    Hubungi Pemilik Kost
                  </h3>

                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-zinc-500 sm:hidden">
                    Mandiri
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-zinc-500 sm:mt-2 sm:text-sm sm:leading-6">
                  Hubungi pemilik kost secara langsung.
                </p>

                <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-zinc-600 transition group-hover:text-[#BE1E2D] sm:mt-5 sm:text-xs">
                  Pilih opsi mandiri

                  <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </button>

            {/* =====================================================
          OPSI PREMIUM: KOST FINDER
      ====================================================== */}
            {/*
            <button
              type="button"
              disabled={!hasActivePublicRelation}
              onClick={() => {
                setIsChoiceOpen(false);
                setIsFinderOpen(true);
              }}
              className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-red-200 bg-linear-to-br from-[#BE1E2D] via-[#B21B2A] to-[#8F1420] p-3.5 text-left text-white shadow-lg shadow-red-950/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-950/25 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:min-h-64 sm:flex-col sm:items-stretch sm:p-5"
            >
              <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/10 sm:h-40 sm:w-40" />

              <div className="absolute -bottom-16 -left-10 h-28 w-28 rounded-full bg-white/5 sm:h-40 sm:w-40" />

              <div className="relative flex shrink-0 items-center justify-between gap-3 sm:w-full">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur sm:h-11 sm:w-11 sm:rounded-2xl">
                  <Search className="h-5 w-5" />
                </div>

                <span className="hidden items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-300/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-200 backdrop-blur sm:inline-flex">
                  <Crown className="h-3.5 w-3.5" />
                  Dibantu Tim Kami
                </span>
              </div>

              <div className="relative min-w-0 flex-1 sm:mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-black text-white sm:text-base">
                    Gunakan Layanan Kost Finder
                  </h3>

                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-300/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-amber-200 backdrop-blur sm:hidden">
                    <Crown className="h-3 w-3" />
                    Dibantu Tim Kami
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-white/80 sm:mt-2 sm:text-sm sm:leading-6">
                  Dapatkan bantuan tim kami untuk mencari kost yang
                  sesuai.
                </p>

                {hasActivePublicRelation ? (
                  <div className="mt-2 flex items-center gap-1 text-[11px] font-black text-white sm:mt-5 sm:text-xs">
                    Mulai gunakan Kost Finder

                    <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] font-bold text-white/80 sm:mt-5 sm:text-xs">
                    Public Relation belum tersedia.
                  </p>
                )}
              </div>
            </button>
            */}
          </div>
        </DialogContent>
      </Dialog>

      {/* =========================================================
    DIALOG FORM KOST FINDER
========================================================== */}
      <Dialog
        open={isFinderOpen}
        onOpenChange={handleFinderDialogChange}
      >
        <DialogContent className="max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl border border-red-100 bg-[#FAFAFC] p-0 shadow-2xl shadow-red-950/10 sm:max-w-lg sm:rounded-3xl">
          <div className="border-b border-red-100 bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF] px-4 py-4 sm:px-6 sm:py-5">
            <DialogHeader>
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100 sm:mb-3 sm:h-11 sm:w-11 sm:rounded-2xl">
                <Search className="h-5 w-5" />
              </div>

              <DialogTitle className="pr-6 text-lg font-black tracking-tight text-zinc-950 sm:text-xl">
                Gunakan Layanan Kost Finder
              </DialogTitle>

              <DialogDescription className="text-xs leading-5 text-zinc-500 sm:text-sm sm:leading-6">
                Lengkapi data singkat agar tim kami dapat membantu
                dengan lebih mudah.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form
            action={`/api/kost/${slug}/contact/finder`}
            method="POST"
            target="_blank"
            onSubmit={handleFinderSubmit}
            className="space-y-3.5 p-4 sm:space-y-5 sm:p-6"
          >
            {/* Nama */}
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="customer-name"
                className="text-xs font-black text-zinc-950 sm:text-sm"
              >
                Nama
              </label>

              <input
                id="customer-name"
                name="customerName"
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                maxLength={80}
                placeholder="Masukkan nama kamu"
                className="h-11 w-full rounded-xl border border-red-100 bg-white px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#BE1E2D] focus:ring-4 focus:ring-red-100 sm:h-12 sm:px-4"
                required
              />
            </div>

            {/* Program studi dan angkatan */}
            <div className="grid grid-cols-[1fr_104px] gap-3 sm:grid-cols-[1fr_140px] sm:gap-4">
              <div className="min-w-0 space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="study-program"
                  className="text-xs font-black text-zinc-950 sm:text-sm"
                >
                  Program Studi
                </label>

                <input
                  id="study-program"
                  name="studyProgram"
                  type="text"
                  value={studyProgram}
                  onChange={(event) =>
                    setStudyProgram(event.target.value)
                  }
                  maxLength={100}
                  placeholder="Contoh: Ilmu Komputer"
                  className="h-11 w-full rounded-xl border border-red-100 bg-white px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#BE1E2D] focus:ring-4 focus:ring-red-100 sm:h-12 sm:px-4"
                  required
                />
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <label
                  htmlFor="cohort"
                  className="text-xs font-black text-zinc-950 sm:text-sm"
                >
                  Angkatan
                </label>

                <input
                  id="cohort"
                  name="cohort"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{2,4}"
                  value={cohort}
                  onChange={(event) =>
                    setCohort(
                      event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4),
                    )
                  }
                  maxLength={4}
                  placeholder="63"
                  className="h-11 w-full rounded-xl border border-red-100 bg-white px-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#BE1E2D] focus:ring-4 focus:ring-red-100 sm:h-12 sm:px-4"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/70 px-3 py-2.5 sm:rounded-2xl sm:px-3.5 sm:py-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#BE1E2D]" />

              <p className="text-[11px] leading-4 text-zinc-600 sm:text-xs sm:leading-5">
                Data hanya digunakan untuk menyusun pesan pembuka
                WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#BE1E2D] px-4 text-sm font-black text-white shadow-lg shadow-red-950/10 transition duration-300 hover:bg-[#9F1725] sm:h-12 sm:hover:-translate-y-0.5"
            >
              <WhatsappLogo />
              Lanjutkan ke WhatsApp

              <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* =========================================================
    ALERT LAYANAN TUTUP
========================================================== */}
      <AlertDialog
        open={isUnavailableOpen}
        onOpenChange={setIsUnavailableOpen}
      >
        <AlertDialogContent className="max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-red-100 bg-white p-0 shadow-2xl shadow-red-950/10 sm:max-w-md sm:rounded-3xl">
          <div className="border-b border-red-100 bg-linear-to-br from-white via-[#FFF7F8] to-[#F4F6FF] px-4 py-4 sm:px-6 sm:py-5">
            <AlertDialogHeader>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
                <Clock3 className="h-5 w-5" />
              </div>

              <AlertDialogTitle className="pr-5 text-lg font-black tracking-tight text-zinc-950 sm:text-xl">
                Layanan WhatsApp Belum Tersedia
              </AlertDialogTitle>

              <AlertDialogDescription className="text-xs leading-5 text-zinc-500 sm:text-sm sm:leading-6">
                {unavailableMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>

          <div className="space-y-3 p-4 sm:space-y-4 sm:p-6">
            <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/70 p-3 sm:rounded-2xl sm:p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#BE1E2D] ring-1 ring-red-100 sm:h-9 sm:w-9 sm:rounded-xl">
                <CalendarClock className="h-4 w-4" />
              </div>

              <p className="text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6">
                Silakan kembali pada jam operasional untuk menghubungi
                pemilik kost atau menggunakan Kost Finder.
              </p>
            </div>

            <AlertDialogFooter>
              <AlertDialogAction className="h-11 w-full rounded-xl bg-[#BE1E2D] px-5 text-sm font-black text-white transition hover:bg-[#9F1725] sm:w-auto">
                Mengerti
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * Logo WhatsApp satu warna.
 * Warna mengikuti warna teks parent.
 */
function WhatsappLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.46 14.86L2 22l5.28-1.54A9.95 9.95 0 1 0 12.04 2Zm0 17.98a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.13.91.94-3.05-.2-.31a8.04 8.04 0 1 1 6.82 3.76Zm4.43-6.03c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}