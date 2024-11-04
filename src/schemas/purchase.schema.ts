import { z } from "zod";

export const CreatePurchaseSchema = z.object({
  body: z.object({
    payment_method: z.enum(["Visa Crédito", "Visa Débito", "MasterCard Crédito", "MasterCard Débito"]),
    discount_applied: z.number(),
    total_price: z.number(),
    user: z.number().int().positive(),
    ticket: z.array(z.number()).optional(),
  }),
});

export const UpdatePurchaseSchema = z.object({
  body: z
    .object({
      payment_method: z.enum(["Visa Crédito", "Visa Débito", "MasterCard Crédito", "MasterCard Débito"]).optional(),
      discount_applied: z.number().optional(),
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
