import { z } from "zod";

// Schema simplificado: solo campos necesarios del cliente
// userId se obtiene del token JWT, no del body
export const CreatePurchaseSchema = z.object({
  body: z.object({
    ticketTypeId: z.number().int().positive(),
    ticketQuantity: z.number().int().positive().min(1).max(10, "Maximum 10 tickets per purchase"),
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
