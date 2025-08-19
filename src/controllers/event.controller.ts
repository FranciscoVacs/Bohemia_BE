import type { Event } from "../entities/event.entity.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import type { RequiredEntityData } from "@mikro-orm/core";

export class EventController extends BaseController<Event> {
  constructor(protected model: IModel<Event>) {
    super(model);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { event_name, begin_datetime, finish_datetime, event_description, min_age, location,dj } = req.body;
      const fileName = req.file?.filename;
      const basePath = `${req.protocol}://${req.hostname}:${process.env.PORT}/public/uploads/`;
      const event = await this.model.create({
        event_name,
        begin_datetime,
        finish_datetime,
        event_description,
        min_age,
        cover_photo: `${basePath}${fileName}` || "",
        location,
        dj,
      }as RequiredEntityData<Event>);
      
      return res.status(201).send({ message: "Item created", data: event });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { body } = req;

      // Handle the case where only finish_datetime is provided
      if (body.finish_datetime && !body.begin_datetime) {
        const existingEvent = await this.model.getById(id);
        if (!existingEvent) {
          // Let the default not found handler catch this
          throw new Error("Event not found");
        }
        if (dayjs(body.finish_datetime).isBefore(existingEvent.begin_datetime)) {
          throw new Error(
            "Validation failed: Finish datetime must be after the event's begin datetime"
          );
        }
      }

      // Agrega cover_photo solo si hay un nuevo archivo
      if (req.file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.hostname}:${process.env.PORT}/public/uploads/`;
        body.cover_photo = `${basePath}${fileName}`;
      }

      await this.model.update(id, body);
      return res.status(200).send({ message: "Item updated" });
    } catch (error) {
      next(error);
    }
  };


  
}
