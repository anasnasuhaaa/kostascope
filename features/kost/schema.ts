import { z } from "zod";

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
}, z.number().int().nonnegative().optional());

const optionalPositiveNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
}, z.number().int().positive().optional());

const optionalString = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().optional());

const optionalUrl = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}, z.string().url("Link Google Maps tidak valid").optional());

export const kostSchema = z
  .object({
    name: z.string().min(3, "Nama kost minimal 3 karakter"),
    description: optionalString,
    contactWhatsapp: z.string().min(8, "Nomor WhatsApp wajib diisi"),

    monthlyPrice: optionalPositiveNumber,
    sixMonthPrice: optionalPositiveNumber,
    yearlyPrice: optionalPositiveNumber,

    roomSize: optionalString,
    distanceToCampusInMeters: optionalNumber,
    googleMapsUrl: optionalUrl,

    genderType: z.enum(["PUTRA", "PUTRI", "CAMPUR"]).optional(),
    waterFeeType: z.enum(["INCLUDED", "NOT_INCLUDED"]),
    electricityType: z.enum(["INCLUDED", "TOKEN", "SEPARATE"]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),

    isFeatured: z.boolean().optional(),

    regionId: z.string().min(1, "Wilayah wajib dipilih"),
    facilityIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => data.monthlyPrice || data.sixMonthPrice || data.yearlyPrice,
    {
      message: "Minimal isi salah satu harga sewa",
      path: ["monthlyPrice"],
    },
  );

export type KostSchema = z.infer<typeof kostSchema>;
