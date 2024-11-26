import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const CreateTicketTypeSchema = z.object({
  body: z.object({
    ticketType_name: z.string().max(100),
    begin_datetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    finish_datetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    price: z.coerce.number().positive().int(),
    event: z.coerce.number(),
  }),
});

export const UpdateTicketTypeSchema = z.object({
  body: z
    .object({
      ticketType_name: z.string().max(100).optional(),
      begin_datetime: z.date().optional(),
      finish_datetime: z.date().optional(),
      price: z.coerce.number().positive().int().optional(),
      event: z.coerce.number().optional(),
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
