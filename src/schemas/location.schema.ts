import { z } from "zod";

export const CreateLocationSchema = z.object({
  body: z.object({
    location_name: z.string().max(100),
    address: z.string().max(100),
    city: z.number().int().positive(),
    event: z.array(z.number()).optional(),
  }),
});

export const UpdateLocationSchema = z.object({
  body: z
    .object({
        location_name: z.string().max(100).optional(),
        address: z.string().max(100).optional(),
        city: z.array(z.number()).optional(),
        event: z.array(z.number()).optional(),
    }),
  params: z.object({
    id: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num.toString() === val;
      })
  }),
});
