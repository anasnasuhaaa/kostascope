"use client";

import { useState, useTransition } from "react";
import {
  CalendarDays,
  Clock3,
  Power,
  RotateCcw,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  resetContactServiceSettingAction,
  saveContactServiceSettingAction,
} from "@/features/contact-service/actions";
import {
  DAY_OPTIONS,
  type ContactServiceDay,
} from "@/features/contact-service/constants";

type ScheduleFormItem = {
  day: ContactServiceDay;
  label: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
};

type ContactServiceFormProps = {
  initialIsActive: boolean;
  initialSchedules: ScheduleFormItem[];
};

export default function ContactServiceForm({
  initialIsActive,
  initialSchedules,
}: ContactServiceFormProps) {
  const [isPending, startTransition] = useTransition();

  const [serviceIsActive, setServiceIsActive] =
    useState(initialIsActive);

  const [schedules, setSchedules] =
    useState(initialSchedules);

  function updateSchedule(
    day: ContactServiceDay,
    update: Partial<ScheduleFormItem>,
  ) {
    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.day === day
          ? {
              ...schedule,
              ...update,
            }
          : schedule,
      ),
    );
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result =
        await saveContactServiceSettingAction(formData);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Kembalikan jadwal layanan ke pengaturan awal? Jadwal yang tersimpan saat ini akan diganti.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result =
        await resetContactServiceSettingAction();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      /**
       * Refresh penuh agar nilai jadwal terbaru dari server
       * langsung tampil pada seluruh input.
       */
      window.location.reload();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* =========================================================
          STATUS LAYANAN GLOBAL
      ========================================================== */}
      <section className="rounded-3xl border bg-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
              <Power className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black">
                Status Layanan WhatsApp
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Nonaktifkan layanan jika komunikasi WhatsApp
                perlu dihentikan sementara. Pengguna akan melihat
                pemberitahuan bahwa layanan belum tersedia.
              </p>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3">
            <input
              name="serviceIsActive"
              type="checkbox"
              checked={serviceIsActive}
              disabled={isPending}
              onChange={(event) =>
                setServiceIsActive(event.target.checked)
              }
              className="h-4 w-4 accent-[#BE1E2D]"
            />

            <span
              className={[
                "text-sm font-black",
                serviceIsActive
                  ? "text-green-700"
                  : "text-zinc-500",
              ].join(" ")}
            >
              {serviceIsActive
                ? "Layanan Aktif"
                : "Layanan Nonaktif"}
            </span>
          </label>
        </div>
      </section>

      {/* =========================================================
          JADWAL LAYANAN
      ========================================================== */}
      <section className="rounded-3xl border bg-background p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#BE1E2D] ring-1 ring-red-100">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-black">
              Jadwal Layanan Mingguan
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              Atur hari dan jam operasional layanan WhatsApp.
              Zona waktu yang digunakan adalah WIB
              (Asia/Jakarta).
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border">
          <table className="min-w-180 w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="px-4 py-3 text-left">
                  Hari
                </th>

                <th className="px-4 py-3 text-center">
                  Status
                </th>

                <th className="px-4 py-3 text-left">
                  Jam Mulai
                </th>

                <th className="px-4 py-3 text-left">
                  Jam Selesai
                </th>
              </tr>
            </thead>

            <tbody>
              {DAY_OPTIONS.map((day) => {
                const schedule = schedules.find(
                  (item) => item.day === day.value,
                );

                if (!schedule) {
                  return null;
                }

                return (
                  <tr
                    key={day.value}
                    className="border-t"
                  >
                    <td className="px-4 py-3 font-bold">
                      {day.label}
                    </td>

                    <td className="px-4 py-3">
                      <label className="flex cursor-pointer items-center justify-center gap-2">
                        <input
                          name={`day-${day.value}-isActive`}
                          type="checkbox"
                          checked={schedule.isActive}
                          disabled={isPending}
                          onChange={(event) =>
                            updateSchedule(day.value, {
                              isActive:
                                event.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-[#BE1E2D]"
                        />

                        <span
                          className={[
                            "text-xs font-bold",
                            schedule.isActive
                              ? "text-green-700"
                              : "text-zinc-400",
                          ].join(" ")}
                        >
                          {schedule.isActive
                            ? "Aktif"
                            : "Libur"}
                        </span>
                      </label>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-[#BE1E2D]" />

                        <input
                          name={`day-${day.value}-start`}
                          type="time"
                          value={schedule.startTime}
                          disabled={isPending}
                          onChange={(event) =>
                            updateSchedule(day.value, {
                              startTime:
                                event.target.value,
                            })
                          }
                          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100"
                          required
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4 shrink-0 text-[#BE1E2D]" />

                        <input
                          name={`day-${day.value}-end`}
                          type="time"
                          value={schedule.endTime}
                          disabled={isPending}
                          onChange={(event) =>
                            updateSchedule(day.value, {
                              endTime:
                                event.target.value,
                            })
                          }
                          className="h-10 rounded-xl border bg-background px-3 text-sm outline-none transition focus:border-[#BE1E2D] focus:ring-2 focus:ring-red-100"
                          required
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          BUTTON ACTION
      ========================================================== */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />

          Reset Jadwal
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#BE1E2D] text-white hover:bg-[#9F1725]"
        >
          <Save className="mr-2 h-4 w-4" />

          {isPending
            ? "Menyimpan..."
            : "Simpan Pengaturan"}
        </Button>
      </div>
    </form>
  );
}