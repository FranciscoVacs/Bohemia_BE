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
      const id = req.params.id;
      const { body } = req;

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
