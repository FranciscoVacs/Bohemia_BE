import { z } from "zod";

/**
 * Schema para validar los parámetros de la ruta de estadísticas de evento
 */
export const EventStatsSchema = z.object({
  params: z.object({
    eventId: z
      .string()
      .refine((val) => {
        const num = Number.parseInt(val);
        return !Number.isNaN(num) && num > 0;
      }, "El ID del evento debe ser un número válido"),
  }),
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number.parseInt(val) : 10))
      .refine((val) => !Number.isNaN(val) && val > 0 && val <= 50, "Limit debe ser entre 1 y 50"),
  }).optional(),
});
