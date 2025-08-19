import { z } from "zod";
import dayjs from "dayjs";

export const CreateTicketTypeSchema = z.object({
  body: z
    .object({
      ticketType_name: z.string().max(100),
      begin_datetime: z.string().refine((val) => dayjs(val).isValid(), {
        message: "Invalid begin datetime format",
      }),
      finish_datetime: z.string().refine((val) => dayjs(val).isValid(), {
        message: "Invalid finish datetime format",
      }),
      price: z.coerce.number().positive(),
      max_quantity: z.coerce.number().int().positive(),
      event: z.coerce.number(),
    })
    .refine(
      (data) => {
        return dayjs(data.finish_datetime).isAfter(dayjs(data.begin_datetime));
      },
      {
        message: "Finish datetime must be after begin datetime",
        path: ["finish_datetime"],
      }
    )
    .refine(
      (data) => {
        return dayjs(data.begin_datetime).isAfter(dayjs());
      },
      {
        message: "Begin datetime must be in the future",
        path: ["begin_datetime"],
      }
    ),
});

export const UpdateTicketTypeSchema = z.object({
  body: z
    .object({
      ticketType_name: z.string().max(100).optional(),
      begin_datetime: z
        .string()
        .refine((val) => dayjs(val).isValid(), {
          message: "Invalid begin datetime format",
        })
        .optional(),
      finish_datetime: z
        .string()
        .refine((val) => dayjs(val).isValid(), {
          message: "Invalid finish datetime format",
        })
        .optional(),
      price: z.coerce.number().positive().optional(),
      max_quantity: z.coerce.number().int().positive().optional(),
      event: z.coerce.number().optional(),
    })
    .refine(
      (data) => {
        if (data.begin_datetime && data.finish_datetime) {
          return dayjs(data.finish_datetime).isAfter(
            dayjs(data.begin_datetime)
          );
        }
        return true;
      },
      {
        message: "Finish datetime must be after begin datetime",
        path: ["finish_datetime"],
      }
    )
    .refine(
      (data) => {
        if (data.begin_datetime) {
          return dayjs(data.begin_datetime).isAfter(dayjs());
        }
        return true;
      },
      {
        message: "Begin datetime must be in the future",
        path: ["begin_datetime"],
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
