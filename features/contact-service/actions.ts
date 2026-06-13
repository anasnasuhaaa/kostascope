"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  DAY_OPTIONS,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  getDefaultDayStatus,
  type ContactServiceDay,
} from "@/features/contact-service/constants";
import { prisma } from "@/lib/prisma";

type ContactServiceActionResult = {
  success: boolean;
  message: string;
};

const SETTING_ID = "default";
const DEFAULT_TIMEZONE = "Asia/Jakarta";

/**
 * Memastikan hanya admin yang sudah login
 * dapat mengubah pengaturan layanan WhatsApp.
 */
async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

/**
 * Mengubah format HH:mm menjadi jumlah menit
 * sejak pukul 00.00.
 *
 * Contoh:
 * 08:00 → 480
 * 17:00 → 1020
 */
function timeToMinute(value: string) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
    value,
  );

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  return hour * 60 + minute;
}

function revalidateContactServicePages() {
  revalidatePath("/admin/contact-service");
  revalidatePath("/kost");
}

/**
 * ============================================================
 * SIMPAN ATAU PERBARUI PENGATURAN
 * ============================================================
 *
 * Menggunakan upsert agar:
 * - konfigurasi dibuat jika belum tersedia;
 * - konfigurasi diperbarui jika sudah tersedia.
 *
 * Seluruh perubahan disimpan di dalam transaction.
 */
export async function saveContactServiceSettingAction(
  formData: FormData,
): Promise<ContactServiceActionResult> {
  try {
    await requireAdmin();

    const isActive =
      formData.get("serviceIsActive") === "on";

    const parsedSchedules = DAY_OPTIONS.map((day) => {
      const isDayActive =
        formData.get(`day-${day.value}-isActive`) ===
        "on";

      const startTime = String(
        formData.get(`day-${day.value}-start`) ?? "",
      );

      const endTime = String(
        formData.get(`day-${day.value}-end`) ?? "",
      );

      const startMinute = timeToMinute(startTime);
      const endMinute = timeToMinute(endTime);

      return {
        day: day.value,
        label: day.label,
        isActive: isDayActive,
        startMinute,
        endMinute,
      };
    });

    for (const schedule of parsedSchedules) {
      if (
        schedule.startMinute === null ||
        schedule.endMinute === null
      ) {
        return {
          success: false,
          message: `Format jam layanan ${schedule.label} tidak valid`,
        };
      }

      if (
        schedule.isActive &&
        schedule.startMinute >= schedule.endMinute
      ) {
        return {
          success: false,
          message: `Jam selesai ${schedule.label} harus lebih besar daripada jam mulai`,
        };
      }
    }

    await prisma.$transaction(async (transaction) => {
      await transaction.contactServiceSetting.upsert({
        where: {
          id: SETTING_ID,
        },

        create: {
          id: SETTING_ID,
          isActive,
          timezone: DEFAULT_TIMEZONE,
        },

        update: {
          isActive,
          timezone: DEFAULT_TIMEZONE,
        },
      });

      for (const schedule of parsedSchedules) {
        await transaction.contactServiceSchedule.upsert({
          where: {
            settingId_day: {
              settingId: SETTING_ID,
              day: schedule.day,
            },
          },

          create: {
            settingId: SETTING_ID,
            day: schedule.day,
            isActive: schedule.isActive,
            startMinute: schedule.startMinute!,
            endMinute: schedule.endMinute!,
          },

          update: {
            isActive: schedule.isActive,
            startMinute: schedule.startMinute!,
            endMinute: schedule.endMinute!,
          },
        });
      }
    });

    revalidateContactServicePages();

    return {
      success: true,
      message:
        "Pengaturan layanan WhatsApp berhasil disimpan",
    };
  } catch (error) {
    console.error(
      "SAVE_CONTACT_SERVICE_SETTING_ERROR",
      error,
    );

    return {
      success: false,
      message:
        "Pengaturan layanan WhatsApp gagal disimpan",
    };
  }
}

/**
 * ============================================================
 * RESET PENGATURAN
 * ============================================================
 *
 * Mengembalikan jadwal menjadi:
 * - layanan global aktif;
 * - Senin–Sabtu aktif;
 * - Minggu nonaktif;
 * - jam layanan 08.00–17.00 WIB.
 */
export async function resetContactServiceSettingAction(): Promise<ContactServiceActionResult> {
  try {
    await requireAdmin();

    const defaultStartMinute =
      timeToMinute(DEFAULT_START_TIME)!;

    const defaultEndMinute =
      timeToMinute(DEFAULT_END_TIME)!;

    await prisma.$transaction(async (transaction) => {
      await transaction.contactServiceSetting.upsert({
        where: {
          id: SETTING_ID,
        },

        create: {
          id: SETTING_ID,
          isActive: true,
          timezone: DEFAULT_TIMEZONE,
        },

        update: {
          isActive: true,
          timezone: DEFAULT_TIMEZONE,
        },
      });

      for (const day of DAY_OPTIONS) {
        await transaction.contactServiceSchedule.upsert({
          where: {
            settingId_day: {
              settingId: SETTING_ID,
              day: day.value,
            },
          },

          create: {
            settingId: SETTING_ID,
            day: day.value,
            isActive: getDefaultDayStatus(day.value),
            startMinute: defaultStartMinute,
            endMinute: defaultEndMinute,
          },

          update: {
            isActive: getDefaultDayStatus(day.value),
            startMinute: defaultStartMinute,
            endMinute: defaultEndMinute,
          },
        });
      }
    });

    revalidateContactServicePages();

    return {
      success: true,
      message:
        "Pengaturan layanan berhasil dikembalikan ke jadwal awal",
    };
  } catch (error) {
    console.error(
      "RESET_CONTACT_SERVICE_SETTING_ERROR",
      error,
    );

    return {
      success: false,
      message:
        "Pengaturan layanan gagal dikembalikan ke jadwal awal",
    };
  }
}