import { z } from "zod";

export const CreatePurchaseSchema = z.object({
  body: z.object({
    discountApplied: z.number().optional(),
    serviceFee: z.number().optional(),
    ticketQuantity: z.number().int().positive(),
    totalPrice: z.number().optional(),
    userId: z.number().int().positive(),
    ticketTypeId: z.number().int().positive(),
    ticket: z.array(z.number()).optional(),
  }),
});

export const UpdatePurchaseSchema = z.object({
  body: z
    .object({
      discountApplied: z.number().optional(),
      serviceFee: z.number().optional(),
      ticketQuantity: z.number().int().positive().optional(),
      totalPrice: z.number().optional(),
      userId: z.number().int().positive().optional(),
      ticketTypeId: z.number().int().positive().optional(),
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
