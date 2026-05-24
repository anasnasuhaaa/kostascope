import { z } from "zod";

export const regionSchema = z.object({
  name: z.string().min(2, "Nama wilayah minimal 2 karakter"),
});

export type RegionSchema = z.infer<typeof regionSchema>;