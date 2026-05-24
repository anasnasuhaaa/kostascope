import { z } from "zod";

export const facilitySchema = z.object({
  name: z.string().min(2, "Nama fasilitas minimal 2 karakter"),
});

export type FacilitySchema = z.infer<typeof facilitySchema>;