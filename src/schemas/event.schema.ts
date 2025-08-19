import { z } from "zod";
import dayjs from "dayjs";

const datetimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const CreateEventSchema = z.object({
  body: z
    .object({
      event_name: z.string().max(100),
      begin_datetime: z.string().refine((val) => dayjs(val).isValid(), {
        message: "Invalid begin datetime format",
      }),
      finish_datetime: z.string().refine((val) => dayjs(val).isValid(), {
        message: "Invalid finish datetime format",
      }),
      event_description: z.string().max(100),
      min_age: z.coerce.number().int().positive(),
      location: z.coerce.number(),
      dj: z.coerce.number(),
    })
    .refine(
      (data) => {
        return dayjs(data.begin_datetime).isAfter(dayjs());
      },
      {
        message: "Begin datetime must be in the future",
        path: ["begin_datetime"],
      }
    )
    .refine(
      (data) => {
        return dayjs(data.finish_datetime).isAfter(dayjs(data.begin_datetime));
      },
      {
        message: "Finish datetime must be after begin datetime",
        path: ["finish_datetime"],
      }
    ),
});

export const UpdateEventSchema = z.object({
  body: z
    .object({
      event_name: z.string().max(100).optional(),
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
      event_description: z.string().max(100).optional(),
      min_age: z.coerce.number().int().positive().optional(),
      location: z.coerce.number().optional(),
      dj: z.coerce.number().optional(),
    })
    .refine(
      (data) => {
        // If both dates are present, finish must be after begin
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
        // If begin date is present, it must be in the future
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
