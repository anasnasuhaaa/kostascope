export const DAY_OPTIONS = [
  {
    value: "MONDAY",
    label: "Senin",
  },
  {
    value: "TUESDAY",
    label: "Selasa",
  },
  {
    value: "WEDNESDAY",
    label: "Rabu",
  },
  {
    value: "THURSDAY",
    label: "Kamis",
  },
  {
    value: "FRIDAY",
    label: "Jumat",
  },
  {
    value: "SATURDAY",
    label: "Sabtu",
  },
  {
    value: "SUNDAY",
    label: "Minggu",
  },
] as const;

export type ContactServiceDay =
  (typeof DAY_OPTIONS)[number]["value"];

/**
 * Pengaturan awal ketika admin menekan tombol reset.
 */
export const DEFAULT_START_TIME = "08:00";
export const DEFAULT_END_TIME = "17:00";

/**
 * Secara default:
 * - Senin sampai Sabtu aktif;
 * - Minggu nonaktif.
 */
export function getDefaultDayStatus(
  day: ContactServiceDay,
) {
  return day !== "SUNDAY";
}

/**
 * Mengubah menit sejak pukul 00.00 menjadi format HH:mm.
 *
 * Contoh:
 * 480  → 08:00
 * 1020 → 17:00
 */
export function minuteToTime(value: number) {
  const normalizedValue = Math.max(
    0,
    Math.min(value, 1439),
  );

  const hour = Math.floor(normalizedValue / 60);
  const minute = normalizedValue % 60;

  return `${String(hour).padStart(2, "0")}:${String(
    minute,
  ).padStart(2, "0")}`;
}