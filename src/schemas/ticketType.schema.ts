import { z } from "zod";

export const CreateTicketTypeSchema = z.object({
  body: z.object({
    ticketTypeName: z.string().max(100),
    price: z.coerce.number().positive().int(),
    maxQuantity: z.coerce.number().positive().int(),
    event: z.coerce.number(),
    sortOrder: z.coerce.number().int().min(1),
  }),
});

export const UpdateTicketTypeSchema = z.object({
  body: z.object({
    ticketTypeName: z.string().max(100).optional(),
    price: z.coerce.number().positive().int().optional(),
    maxQuantity: z.coerce.number().positive().int().optional(),
    event: z.coerce.number().optional(),
    sortOrder: z.coerce.number().int().min(1).optional(),
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

export const CloseTicketTypeSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num.toString() === val;
      })
  }),
});
