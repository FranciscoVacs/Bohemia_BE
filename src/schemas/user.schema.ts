import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;


export const CreateUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    userName: z.string().max(100),
    userSurname: z.string().max(100),
    password: z.string().max(100),
    birthDate: z.string().refine((val) => datetimeRegex.test(val), {
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
      userName: z.string().max(100).optional(),
      userSurname: z.string().max(100).optional(),
      password: z.string().max(100).optional(),
      birthDate: z.string().refine((val) => datetimeRegex.test(val), {
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
