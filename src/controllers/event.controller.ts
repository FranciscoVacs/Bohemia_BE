import type { Event } from "../entities/event.entity.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import type { RequiredEntityData } from "@mikro-orm/core";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export class EventController extends BaseController<Event> {
  constructor(protected model: IModel<Event>) {
    super(model);
  }

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { eventName, beginDatetime, finishDatetime, eventDescription, minAge, location, dj } = req.body;
    const fileName = req.file?.filename;
    const basePath = `${req.protocol}://${req.hostname}:${process.env.PORT}/public/uploads/`;
    
    const event = await this.model.create({
      eventName,
      beginDatetime,
      finishDatetime,
      eventDescription,
      minAge,
      coverPhoto: `${basePath}${fileName}` || "",
      location,
      dj,
    } as RequiredEntityData<Event>);
    
    return res.status(201).send({ message: "Evento creado exitosamente", data: event });
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { body } = req;

    // Verificar que el evento existe
    const currentEvent = await this.model.getById(id);
    assertResourceExists(currentEvent, `Event with id ${id}`);

    // Agrega coverPhoto solo si hay un nuevo archivo
    if (req.file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.hostname}:${process.env.PORT}/public/uploads/`;
      body.coverPhoto = `${basePath}${fileName}`;
    }

    await this.model.update(id, body);
    return res.status(200).send({ message: "Evento actualizado exitosamente" });
  });

  // Método para obtener eventos futuros (que no hayan terminado)
  getFutureEvents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

    // Un evento es "futuro" si NO ha terminado (finishDatetime > now)
    // Esto incluye eventos que ya comenzaron pero no han terminado
    const futureEvents = allEvents.filter(event => 
      new Date(event.finishDatetime) > now
    );

    return res.status(200).send({
      message: "Eventos futuros obtenidos exitosamente",
      data: futureEvents,
      count: futureEvents.length,
      note: "Incluye eventos en curso y futuros (hasta que terminen)"
    });
  });
}
