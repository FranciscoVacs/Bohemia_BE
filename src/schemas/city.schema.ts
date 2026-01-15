import { z } from "zod";

export const CreateCitySchema = z.object({
  body: z.object({
    cityName: z.string().max(100),
    province: z.string().max(100),
    zipCode: z.number().int().positive(),
    location: z.array(z.number()).optional(),
  }),
});

export const UpdateCitySchema = z.object({
  body: z
    .object({
        cityName: z.string().max(100).optional(),
        province: z.string().max(100).optional(),
        zipCode: z.number().int().positive().optional(),
        location: z.array(z.number()).optional(),
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
