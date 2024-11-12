import { z } from "zod";

export const CreateTicketSchema = z.object({
  body: z.object({
    ticketType: z.number().int().positive(),
  }),
});

export const UpdateTicketSchema = z.object({
  body: z
    .object({
      ticketType: z.number().int().positive().optional(),
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
