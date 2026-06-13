import { NextResponse } from "next/server";

import { getContactServiceStatus } from "@/lib/contact-service";

/**
 * Pastikan status selalu dibaca ulang dari database.
 * Jangan gunakan cache karena admin dapat mengubah jadwal sewaktu-waktu.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const status = await getContactServiceStatus();

  return NextResponse.json(status, {
    status: 200,

    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}