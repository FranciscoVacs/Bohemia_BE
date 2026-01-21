import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// Enum de modos de venta
const saleModeEnum = z.enum(['manual', 'scheduled']);

// Función helper para validar formato de datetime
const isValidDatetime = (val: string) => datetimeRegex.test(val);

// Función helper para validar que finishDatetime sea posterior a beginDatetime
const isFinishAfterBegin = (finishString: string, beginString: string) => {
  const finishDate = new Date(finishString);
  const beginDate = new Date(beginString);
  return finishDate > beginDate;
};

export const CreateTicketTypeSchema = z.object({
  body: z.object({
    ticketTypeName: z.string().max(100),
    beginDatetime: z.string().refine(isValidDatetime, {
      message: "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }).optional(),
    finishDatetime: z.string().refine(isValidDatetime, {
      message: "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
    }).optional(),
    price: z.coerce.number().positive().int(),
    maxQuantity: z.coerce.number().positive().int(),
    event: z.coerce.number(),
    saleMode: saleModeEnum.default('scheduled'),
    isManuallyActivated: z.boolean().default(false),
  })
    .refine(
      (data) => {
        // Si modo es scheduled, las fechas son requeridas
        if (data.saleMode === 'scheduled') {
          return data.beginDatetime && data.finishDatetime;
        }
        return true;
      },
      {
        message: "beginDatetime y finishDatetime son requeridos en modo scheduled",
        path: ["beginDatetime"],
      }
    )
    .refine(
      (data) => {
        // Validar orden de fechas solo si ambas están presentes
        if (data.beginDatetime && data.finishDatetime) {
          return isFinishAfterBegin(data.finishDatetime, data.beginDatetime);
        }
        return true;
      },
      {
        message: "La fecha y hora de finalización debe ser posterior a la de comienzo",
        path: ["finishDatetime"],
      }
    ),
});

export const UpdateTicketTypeSchema = z.object({
  body: z
    .object({
      ticketTypeName: z.string().max(100).optional(),
      beginDatetime: z.string().refine(isValidDatetime, {
        message: "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
      }).optional().nullable(),
      finishDatetime: z.string().refine(isValidDatetime, {
        message: "Invalid datetime format. Expected format: 'YYYY-MM-DD HH:MM:SS'",
      }).optional().nullable(),
      price: z.coerce.number().positive().int().optional(),
      maxQuantity: z.coerce.number().positive().int().optional(),
      event: z.coerce.number().optional(),
      saleMode: saleModeEnum.optional(),
      isManuallyActivated: z.boolean().optional(),
    })
    .refine(
      (data) => {
        // Solo validar si ambos campos están presentes
        if (data.beginDatetime && data.finishDatetime) {
          return isFinishAfterBegin(data.finishDatetime, data.beginDatetime);
        }
        return true;
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
