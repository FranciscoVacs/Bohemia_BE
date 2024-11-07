import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([-+]\d{2}:\d{2}|Z)$/;


export const CreateUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    user_name: z.string().max(100),
    user_surname: z.string().max(100),
    password: z.string().max(100),
    birth_date: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    purchase: z.array(z.number()).optional(),

  }),
});

export const UpdateUserSchema = z.object({
  body: z
    .object({
      email: z.string().email().optional(),
      user_name: z.string().max(100).optional(),
      user_surname: z.string().max(100).optional(),
      password: z.string().max(100).optional(),
      birth_date: z.string().refine((val) => datetimeRegex.test(val), {
        message:
          "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
      }).optional(),
      purchase: z.array(z.number()).optional(),
    }),
  params: z.object({
    id: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num.toString() === val;
      }).optional(),
  }),
});
