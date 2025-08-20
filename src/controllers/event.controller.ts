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
      const { event_name, begin_datetime, finish_datetime, event_description, min_age, location, dj } = req.body;
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
      } as RequiredEntityData<Event>);
      
      return res.status(201).send({ message: "Evento creado exitosamente", data: event });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const { body } = req;

      // Verificar que el evento existe
      const currentEvent = await this.model.getById(id);
      if (!currentEvent) {
        return res.status(404).send({ message: "Evento no encontrado" });
      }

      // Agrega cover_photo solo si hay un nuevo archivo
      if (req.file) {
        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.hostname}:${process.env.PORT}/public/uploads/`;
        body.cover_photo = `${basePath}${fileName}`;
      }

      await this.model.update(id, body);
      return res.status(200).send({ message: "Evento actualizado exitosamente" });
    } catch (error) {
      next(error);
    }
  };

  // Método para obtener eventos futuros (que no hayan terminado)
  getFutureEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      
      // Obtener todos los eventos y filtrar por fecha de finalización
      const allEvents = await this.model.getAll();
      if (!allEvents) {
        return res.status(200).send({
          message: "No hay eventos disponibles",
          data: [],
          count: 0,
        });
      }

      // Un evento es "futuro" si NO ha terminado (finish_datetime > now)
      // Esto incluye eventos que ya comenzaron pero no han terminado
      const futureEvents = allEvents.filter(event => 
        new Date(event.finish_datetime) > now
      );

      return res.status(200).send({
        message: "Eventos futuros obtenidos exitosamente",
        data: futureEvents,
        count: futureEvents.length,
        note: "Incluye eventos en curso y futuros (hasta que terminen)"
      });
    } catch (error) {
      next(error);
    }
  };
}
