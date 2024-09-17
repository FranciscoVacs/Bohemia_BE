import { z } from "zod";

export const CreateLocationSchema = z.object({
  body: z.object({
    location_name: z.string().max(100),
    address: z.string().max(100),
    city: z.string().max(100),
    state: z.string().max(100),
    zip: z.number().int().positive(),
    events: z.array(z.number()).optional(),
  }),
});

export const UpdateLocationSchema = z.object({
  body: z
    .object({
        location_name: z.string().max(100).optional(),
        address: z.string().max(100).optional(),
        city: z.string().max(100).optional(),
        state: z.string().max(100).optional(),
        zip: z.number().int().positive().optional(),
        events: z.array(z.number()).optional(),
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
