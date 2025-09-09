import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// Función helper para validar que finishDatetime sea posterior a beginDatetime
const isFinishAfterBegin = (finishString: string, beginString: string) => {
  const finishDate = new Date(finishString);
  const beginDate = new Date(beginString);
  return finishDate > beginDate;
};

export const CreateTicketTypeSchema = z.object({
  body: z.object({
    ticketTypeName: z.string().max(100),
    beginDatetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    finishDatetime: z.string().refine((val) => datetimeRegex.test(val), {
      message:
        "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }),
    price: z.coerce.number().positive().int(),
    maxQuantity: z.coerce.number().positive().int(),
    event: z.coerce.number(),
  }).refine(
    (data) => isFinishAfterBegin(data.finishDatetime, data.beginDatetime),
    {
      message: "La fecha y hora de finalización debe ser posterior a la de comienzo",
      path: ["finishDatetime"], // Esto hace que el error se asocie al campo finishDatetime
    }
  ),
});

export const UpdateTicketTypeSchema = z.object({
  body: z
    .object({
      ticketTypeName: z.string().max(100).optional(),
      beginDatetime: z.string().refine((val) => datetimeRegex.test(val), {
        message:
          "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
      }).optional(),
      finishDatetime: z.string().refine((val) => datetimeRegex.test(val), {
        message:
          "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
      }).optional(),
      price: z.coerce.number().positive().int().optional(),
      maxQuantity: z.coerce.number().positive().int().optional(),
      event: z.coerce.number().optional(),
    })
    .refine(
      (data) => {
        // Solo validar si ambos campos están presentes
        if (data.beginDatetime && data.finishDatetime) {
          return isFinishAfterBegin(data.finishDatetime, data.beginDatetime);
        }
        return true; // Si no están ambos presentes, no validar
      },
      {
        message: "La fecha y hora de finalización debe ser posterior a la de comienzo",
        path: ["finishDatetime"],
      }
    ),
  params: z.object({
    id: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num.toString() === val;
      })
  }),
});
