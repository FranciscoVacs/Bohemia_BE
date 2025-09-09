import { z } from "zod";

export const CreateDjSchema = z.object({
  body: z.object({
    djName: z.string().max(100),
    djSurname: z.string().max(100),
    djApodo: z.string(),
  }),
});

export const UpdateDjSchema = z.object({
  body: z
    .object({
        djName: z.string().max(100).optional(),
        djSurname: z.string().max(100).optional(),
        djApodo: z.string().optional(),
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
