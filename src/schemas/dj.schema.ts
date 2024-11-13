import { z } from "zod";

export const CreateDjSchema = z.object({
  body: z.object({
    dj_name: z.string().max(100),
    dj_surname: z.string().max(100),
    dj_apodo: z.string(),
  }),
});

export const UpdateDjSchema = z.object({
  body: z
    .object({
        dj_name: z.string().max(100).optional(),
        dj_surname: z.string().max(100).optional(),
        dj_apodo: z.string().optional(),
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
