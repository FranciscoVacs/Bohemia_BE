import type { Event } from "../entities/event.entity.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import type { RequiredEntityData } from "@mikro-orm/core";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { toFutureEventDTO, toAdminEventDTO, toPublicEventDTO, toPublicTicketTypesDTO } from "../dto/event.dto.js";
import sizeOf from "image-size";
import cloudinary from "../config/cloudinaryConfig.js";

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

  // Método para admin: obtener un evento específico con todos los detalles (incluyendo isGalleryPublished)
  getByIdForAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const event = await this.model.getById(id);

    assertResourceExists(event, `Event with id ${id}`);

    // Transformar a DTO admin
    const adminEvent = toAdminEventDTO(event!);

    return res.status(200).send({
      message: "Evento obtenido exitosamente",
      data: adminEvent,
    });
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { eventName, beginDatetime, finishDatetime, eventDescription, minAge, location, dj } = req.body;

    // Validar dimensiones antes de subir a Cloudinary
    let coverPhotoUrl = "";
    if (req.file) {
      const dimensions = sizeOf(new Uint8Array(req.file.buffer));
      if (dimensions.width !== 1000 || dimensions.height !== 800) {
        throwError.badRequest("La imagen debe ser de 1000x800 píxeles exactos. Evento no creado.");
      }

      // Subir a Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event-covers", public_id: `cover-${Date.now()}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      coverPhotoUrl = result.secure_url;
    }

    const event = await this.model.create({
      eventName,
      beginDatetime,
      finishDatetime,
      eventDescription,
      minAge,
      coverPhoto: coverPhotoUrl,
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
      // Validar dimensiones
      const dimensions = sizeOf(new Uint8Array(req.file.buffer));
      if (dimensions.width !== 1000 || dimensions.height !== 800) {
        throwError.badRequest("La imagen debe ser de 1000x800 píxeles exactos.");
      }

      // Subir a Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "event-covers", public_id: `cover-${Date.now()}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      body.coverPhoto = result.secure_url;
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

    // Filtrar eventos PUBLICADOS que no han terminado
    const futureEvents = allEvents.filter(event =>
      event.isPublished && new Date(event.finishDatetime) > now
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

  // Sobrescribir getById para usar DTO público (solo eventos publicados)
  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const event = await this.model.getById(id);

    assertResourceExists(event, `Event with id ${id}`);

    // Solo mostrar si está publicado
    if (!event!.isPublished) {
      throwError.notFound(`Event with id ${id}`);
    }

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

  updateGalleryStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { isGalleryPublished } = req.body;

    if (typeof isGalleryPublished !== 'boolean') {
      throwError.badRequest("isGalleryPublished debe ser un valor booleano (true o false)");
    }

    const event = await this.model.getById(id);
    assertResourceExists(event, `Event with id ${id}`);

    await this.model.update(id, { isGalleryPublished });

    return res.status(200).send({
      message: `Estado de galería actualizado`,
      data: { id, isGalleryPublished }
    });
  });

  // Publicar evento (requiere al menos un ticketType)
  publishEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const event = await this.model.getById(id);

    assertResourceExists(event, `Event with id ${id}`);

    // Verificar que tenga al menos un ticketType
    const ticketTypes = event!.ticketType.getItems();
    if (ticketTypes.length === 0) {
      throwError.badRequest("No se puede publicar un evento sin tipos de tickets. Agregue al menos uno.");
    }

    // Verificar que no esté ya publicado
    if (event!.isPublished) {
      throwError.badRequest("El evento ya está publicado.");
    }

    await this.model.update(id, { isPublished: true });

    return res.status(200).send({
      message: "Evento publicado exitosamente",
      data: { id, isPublished: true }
    });
  });
}
