import { z } from "zod";

export const CreatePurchaseSchema = z.object({
  body: z.object({
    discount_applied: z.number().optional(),
    ticket_quantity: z.number().int().positive(),
    total_price: z.number().optional(),
    user: z.number().int().positive(),
    ticket: z.array(z.number()).optional(),
  }),
});

export const UpdatePurchaseSchema = z.object({
  body: z
    .object({
      discount_applied: z.number().optional(),
      ticket_quantity: z.number().int().positive().optional(),
      total_price: z.number().optional(),
      user: z.number().int().positive().optional(),
      ticket: z.array(z.number()).optional(),
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
