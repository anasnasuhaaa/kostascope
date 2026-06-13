import {
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  DAY_OPTIONS,
  getDefaultDayStatus,
  minuteToTime,
} from "@/features/contact-service/constants";
import ContactServiceForm from "@/features/contact-service/contact-service-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminContactServicePage() {
  const setting =
    await prisma.contactServiceSetting.findUnique({
      where: {
        id: "default",
      },

      include: {
        schedules: true,
      },
    });

  const initialSchedules = DAY_OPTIONS.map((day) => {
    const savedSchedule = setting?.schedules.find(
      (schedule) => schedule.day === day.value,
    );

    return {
      day: day.value,
      label: day.label,

      isActive:
        savedSchedule?.isActive ??
        getDefaultDayStatus(day.value),

      startTime: savedSchedule
        ? minuteToTime(savedSchedule.startMinute)
        : DEFAULT_START_TIME,

      endTime: savedSchedule
        ? minuteToTime(savedSchedule.endMinute)
        : DEFAULT_END_TIME,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          Layanan WhatsApp
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Kelola status dan jadwal layanan WhatsApp
          AngkasaKost. Pengaturan ini berlaku untuk kontak
          langsung pemilik kost dan layanan Kost Finder.
        </p>
      </div>

      {!setting && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm leading-6 text-yellow-800">
          Konfigurasi layanan belum tersimpan. Periksa jadwal
          awal berikut, lalu tekan tombol{" "}
          <strong>Simpan Pengaturan</strong>.
        </div>
      )}

      <ContactServiceForm
        initialIsActive={setting?.isActive ?? false}
        initialSchedules={initialSchedules}
      />
    </div>
  );
}