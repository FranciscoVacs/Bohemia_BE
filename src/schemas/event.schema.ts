import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const CreateEventSchema = z.object({
  body: z.object({
    event_name: z.string().max(100),
    begin_datetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
      "Invalid datetime format. Expected format: 'YYYY-MM-DDTHH:MM:SS±HH:MM' or 'YYYY-MM-DDTHH:MM:SSZ'",
    }),
    finish_datetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
      "Invalid datetime format. Expected format: 'YYYY-MM-DDTHH:MM:SS±HH:MM' or 'YYYY-MM-DDTHH:MM:SSZ'",
    }),
    event_description: z.string().max(100),
    min_age: z.coerce.number().int().positive(),
    location: z.coerce.number(),
    dj: z.coerce.number(),
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
      min_age: z.coerce.number().int().positive().optional(),
      location: z.coerce.number().optional(),
      dj: z.coerce.number().optional(),
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
