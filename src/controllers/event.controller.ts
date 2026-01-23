import type { Event } from "../entities/event.entity.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import type { RequiredEntityData } from "@mikro-orm/core";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { toFutureEventDTO, toAdminEventDTO, toPublicEventDTO, toPublicTicketTypesDTO } from "../dto/event.dto.js";
import sizeOf from "image-size";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Validar dimensiones si hay archivo
    if (req.file) {
      try {
        const dimensions = sizeOf(fs.readFileSync(req.file.path) as any);
        if (dimensions.width !== 1000 || dimensions.height !== 800) {
          // Borrar archivo y lanzar error
          fs.unlinkSync(req.file.path);
          if (event) await this.model.delete(event.id.toString()); // Revertir creación
          throwError.badRequest("La imagen debe ser de 1000x800 píxeles exactos. Evento no creado.");
        }
      } catch (err: any) {
        if (err.message.includes("1000x800")) throw err;
        // Si falla lectura, intentamos limpiar
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        if (event) await this.model.delete(event.id.toString());
        throwError.badRequest("Error al validar imagen. Asegúrese de que sea válida.");
      }
    }

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

      // Validar dimensiones
      try {
        const dimensions = sizeOf(fs.readFileSync(req.file.path) as any);
        if (dimensions.width !== 1000 || dimensions.height !== 800) {
          fs.unlinkSync(req.file.path);
          throwError.badRequest("La imagen debe ser de 1000x800 píxeles exactos.");
        }
      } catch (err: any) {
        if (err.message.includes("1000x800")) throw err;
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        throwError.badRequest("Error al validar imagen.");
      }
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
