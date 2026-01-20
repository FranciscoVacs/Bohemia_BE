import type { Event } from "../entities/event.entity.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import type { RequiredEntityData } from "@mikro-orm/core";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { toFutureEventDTO, toAdminEventDTO, toPublicEventDTO, toPublicTicketTypesDTO } from "../dto/event.dto.js";

export class EventController extends BaseController<Event> {
  constructor(protected model: IModel<Event>) {
    super(model);
  }

  // Método para admin: obtener todos los eventos con métricas calculadas
  getAllForAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allEvents = await this.model.getAll();

    if (!allEvents || allEvents.length === 0) {
      return res.status(200).send({
        message: "No hay eventos",
        data: [],
      });
    }

    // Transformar a AdminEventDTO con campos calculados
    const adminEvents = allEvents.map(event => toAdminEventDTO(event));

    return res.status(200).send({
      message: "Eventos obtenidos exitosamente",
      data: adminEvents,
    });
  });

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

  // Método para obtener el primer evento futuro o en curso
  getFutureEvents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();

    const allEvents = await this.model.getAll();
    if (!allEvents || allEvents.length === 0) {
      return res.status(200).send({
        message: "No hay eventos disponibles",
        data: null,
      });
    }

    // Filtrar eventos que no han terminado
    const futureEvents = allEvents.filter(event =>
      new Date(event.finishDatetime) > now
    );

    if (futureEvents.length === 0) {
      return res.status(200).send({
        message: "No hay eventos proximos",
        data: null,
      });
    }

    // Ordenar por fecha de inicio (más próximo primero)
    futureEvents.sort((a, b) =>
      new Date(a.beginDatetime).getTime() - new Date(b.beginDatetime).getTime()
    );

    // Tomar el primero y mapearlo con el DTO
    const nextEvent = toFutureEventDTO(futureEvents[0]);

    return res.status(200).send({
      message: "Próximo evento obtenido exitosamente",
      data: nextEvent,
    });
  });

  // Sobrescribir getById para usar DTO público
  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const event = await this.model.getById(id);

    assertResourceExists(event, `Event with id ${id}`);

    // Transformar a DTO público (sin exponer datos sensibles)
    const publicEvent = toPublicEventDTO(event!);

    return res.status(200).send({
      message: "Evento obtenido exitosamente",
      data: publicEvent,
    });
  });

  // Endpoint para obtener ticketTypes de un evento específico
  getTicketTypes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const event = await this.model.getById(id);

    assertResourceExists(event, `Event with id ${id}`);

    // Transformar a DTO público de ticketTypes
    const ticketTypes = toPublicTicketTypesDTO(event!);

    return res.status(200).send({
      message: "Tipos de tickets obtenidos exitosamente",
      data: ticketTypes,
    });
  });
}
