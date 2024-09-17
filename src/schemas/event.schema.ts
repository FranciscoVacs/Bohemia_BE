import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const CreateEventSchema = z.object({
  body: z.object({
    event_name: z.string().max(100),
    begin_datetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    finish_datetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    event_description: z.string().max(100),
    min_age: z.number().int().positive(),
    location: z.number(),
  }),
});

export const UpdateEventSchema = z.object({
  body: z
    .object({
      event_name: z.string().max(100).optional(),
      begin_datetime: z
        .string()
        .refine((val) => datetimeRegex.test(val), {
          message:
            "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
        })
        .optional(),
      finish_datetime: z
        .string()
        .refine((val) => datetimeRegex.test(val), {
          message:
            "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
        })
        .optional(),
      event_description: z.string().max(100).optional(),
      min_age: z.number().int().positive().optional(),
      location: z.number().optional(),
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
