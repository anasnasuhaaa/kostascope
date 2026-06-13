import { prisma } from "@/lib/prisma";

type ContactServiceReason =
  | "AVAILABLE"
  | "DISABLED"
  | "OUTSIDE_SCHEDULE"
  | "NOT_CONFIGURED"
  | "ERROR";

export type ContactServiceStatus = {
  isAvailable: boolean;
  reason: ContactServiceReason;
  message: string;
};

const SETTING_ID = "default";

/**
 * Mapping hasil Intl.DateTimeFormat menuju enum Prisma DayOfWeek.
 */
const DAY_MAP = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
} as const;

/**
 * Mengubah menit sejak pukul 00.00 menjadi format HH:mm.
 *
 * Contoh:
 * 480  → 08:00
 * 1020 → 17:00
 */
function minuteToTime(value: number) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;

  return `${String(hour).padStart(2, "0")}:${String(
    minute,
  ).padStart(2, "0")}`;
}

/**
 * Mengambil hari dan waktu saat ini berdasarkan timezone layanan.
 *
 * Default timezone:
 * Asia/Jakarta
 */
function getCurrentDayAndMinute(timezone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());

  const weekday = parts.find(
    (part) => part.type === "weekday",
  )?.value;

  const rawHour = Number(
    parts.find((part) => part.type === "hour")?.value ?? 0,
  );

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value ?? 0,
  );

  /**
   * Sebagian runtime Intl dapat menghasilkan hour 24
   * ketika tepat tengah malam. Normalisasikan menjadi 0.
   */
  const hour = rawHour === 24 ? 0 : rawHour;

  const day =
    DAY_MAP[weekday as keyof typeof DAY_MAP] ??
    "MONDAY";

  return {
    day,
    currentMinute: hour * 60 + minute,
  };
}

/**
 * ============================================================
 * CEK STATUS LAYANAN WHATSAPP
 * ============================================================
 *
 * Urutan pemeriksaan:
 * 1. Apakah konfigurasi sudah tersedia?
 * 2. Apakah layanan global sedang aktif?
 * 3. Apakah hari ini merupakan hari layanan?
 * 4. Apakah waktu saat ini berada dalam jam layanan?
 */
export async function getContactServiceStatus(): Promise<ContactServiceStatus> {
  try {
    const setting =
      await prisma.contactServiceSetting.findUnique({
        where: {
          id: SETTING_ID,
        },

        include: {
          schedules: true,
        },
      });

    if (!setting) {
      return {
        isAvailable: false,
        reason: "NOT_CONFIGURED",
        message:
          "Pengaturan layanan WhatsApp belum disimpan oleh admin. Silakan coba kembali nanti.",
      };
    }

    if (!setting.isActive) {
      return {
        isAvailable: false,
        reason: "DISABLED",
        message:
          "Layanan WhatsApp AngkasaKost sedang dinonaktifkan sementara. Silakan coba kembali nanti.",
      };
    }

    const { day, currentMinute } =
      getCurrentDayAndMinute(setting.timezone);

    const schedule = setting.schedules.find(
      (item) => item.day === day,
    );

    if (!schedule || !schedule.isActive) {
      return {
        isAvailable: false,
        reason: "OUTSIDE_SCHEDULE",
        message:
          "Hari ini layanan WhatsApp AngkasaKost sedang tutup. Silakan hubungi kami kembali pada hari operasional.",
      };
    }

    const isInsideSchedule =
      currentMinute >= schedule.startMinute &&
      currentMinute < schedule.endMinute;

    if (!isInsideSchedule) {
      return {
        isAvailable: false,
        reason: "OUTSIDE_SCHEDULE",
        message: `Saat ini kamu berada di luar jam layanan WhatsApp AngkasaKost. Jam layanan hari ini adalah pukul ${minuteToTime(
          schedule.startMinute,
        )}–${minuteToTime(schedule.endMinute)} WIB.`,
      };
    }

    return {
      isAvailable: true,
      reason: "AVAILABLE",
      message: "Layanan WhatsApp tersedia.",
    };
  } catch (error) {
    console.error(
      "GET_CONTACT_SERVICE_STATUS_ERROR",
      error,
    );

    return {
      isAvailable: false,
      reason: "ERROR",
      message:
        "Terjadi kendala ketika memeriksa jam layanan WhatsApp. Silakan coba kembali beberapa saat lagi.",
    };
  }
}