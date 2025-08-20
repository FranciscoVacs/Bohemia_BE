import { z } from "zod";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// Función helper para validar que una fecha sea futura
const isFutureDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

// Función helper para validar que finish_datetime sea posterior a begin_datetime
const isFinishAfterBegin = (finishString: string, beginString: string) => {
  const finishDate = new Date(finishString);
  const beginDate = new Date(beginString);
  return finishDate > beginDate;
};

// Función helper para validar formato de fecha
const isValidDateTimeFormat = (dateString: string) => {
  return datetimeRegex.test(dateString);
};

export const CreateEventSchema = z.object({
  body: z.object({
    eventName: z.string().max(100, "El nombre del evento no puede exceder 100 caracteres"),
    beginDatetime: z
      .string()
      .refine(isValidDateTimeFormat, {
        message: "Formato de fecha inválido. Formato esperado: 'YYYY-MM-DD HH:MM:SS'",
      })
      .refine(isFutureDate, {
        message: "La fecha y hora de comienzo debe ser futura",
      }),
    finishDatetime: z
      .string()
      .refine(isValidDateTimeFormat, {
        message: "Formato de fecha inválido. Formato esperado: 'YYYY-MM-DD HH:MM:SS'",
      })
      .refine(isFutureDate, {
        message: "La fecha y hora de finalización debe ser futura",
      }),
    eventDescription: z.string().max(100, "La descripción del evento no puede exceder 100 caracteres"),
    minAge: z.coerce.number().int().positive("La edad mínima debe ser un número entero positivo"),
    location: z.coerce.number().int().positive("La ubicación debe ser un ID válido"),
    dj: z.coerce.number().int().positive("El DJ debe ser un ID válido"),
  }).refine(
    (data) => isFinishAfterBegin(data.finishDatetime, data.beginDatetime),
    {
      message: "La fecha y hora de finalización debe ser posterior a la de comienzo",
      path: ["finishDatetime"], // Indica qué campo tiene el error
    }
  ),
});

export const UpdateEventSchema = z.object({
  body: z
    .object({
      eventName: z.string().max(100, "El nombre del evento no puede exceder 100 caracteres").optional(),
      beginDatetime: z
        .string()
        .refine(isValidDateTimeFormat, {
          message: "Formato de fecha inválido. Formato esperado: 'YYYY-MM-DD HH:MM:SS'",
        })
        .refine(isFutureDate, {
          message: "La fecha y hora de comienzo debe ser futura",
        })
        .optional(),
      finishDatetime: z
        .string()
        .refine(isValidDateTimeFormat, {
          message: "Formato de fecha inválido. Formato esperado: 'YYYY-MM-DD HH:MM:SS'",
        })
        .refine(isFutureDate, {
          message: "La fecha y hora de finalización debe ser futura",
        })
        .optional(),
      eventDescription: z.string().max(100, "La descripción del evento no puede exceder 100 caracteres").optional(),
      minAge: z.coerce.number().int().positive("La edad mínima debe ser un número entero positivo").optional(),
      location: z.coerce.number().int().positive("La ubicación debe ser un ID válido").optional(),
      dj: z.coerce.number().int().positive("El DJ debe ser un ID válido").optional(),
    })
    .refine(
      (data) => {
        // Si ambas fechas están presentes, validar que finish > begin
        if (data.beginDatetime && data.finishDatetime) {
          return isFinishAfterBegin(data.finishDatetime, data.beginDatetime);
        }
        // Si solo una fecha está presente, la validación se hará en el controlador
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
      }, "El ID debe ser un número válido")
  }),
});
