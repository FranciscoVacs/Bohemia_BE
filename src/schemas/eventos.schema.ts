import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const CreateEventosSchema = z.object({
  body: z.object({
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
    location_id: z.number(),
  }),
  params: z.object({
    id: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num.toString() === val;
      })
      .optional(),
  }),
});

export const UpdateEventosSchema = z.object({
  body: z
    .object({
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
      location_id: z.number().optional(),
    })
    .optional(),
  params: z.object({
    id: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num.toString() === val;
      })
      .optional(),
  }),
});
