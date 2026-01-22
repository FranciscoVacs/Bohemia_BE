import type { EventPhoto } from "../entities/eventPhoto.entity.js";
import type { IEventPhotoModel } from "../interfaces/eventPhoto.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import { throwError } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { NotFoundError } from "../shared/errors/AppError.js";
import { EventModel } from "../models/orm/event.model.js";
import uploadEventPhoto from "../middlewares/uploadEventPhoto.js";
import { RequiredEntityData } from "@mikro-orm/core";
import { toGalleryEventDTO } from "../dto/event.dto.js";

export class EventPhotoController extends BaseController<EventPhoto> {
    constructor(protected model: IEventPhotoModel<EventPhoto>, private eventModel: EventModel) {
        super(model);
    }

    // Upload de fotos a Cloudinary
    uploadPhotos = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const event = await this.eventModel.getById(eventId);
        if (!event) {
            throw new NotFoundError("Event not found");
        }

        // Middleware dinámico para subir a carpeta específica
        const uploadMiddleware = uploadEventPhoto(`events/${event.eventName.trim()}`).array('photos', 50);

        uploadMiddleware(req, res, async (err: any) => {
            if (err) {
                throwError.badRequest(`Upload error: ${err.message}`);
                return;
            }

            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                throwError.badRequest("No se subieron fotos");
                return;
            }

            // Guardar referencias en la base de datos
            const photoEntries = [];
            for (const file of files) {
                const photoData = {
                    event: +eventId,
                    cloudinaryUrl: file.path,
                    publicId: file.filename,
                    originalName: file.originalname,
                } as RequiredEntityData<EventPhoto>;

                const photo = await this.model.create(photoData);
                photoEntries.push(photo);
            }

            return res.status(201).send({
                success: true,
                message: `${files.length} fotos subidas exitosamente`,
                data: photoEntries
            });
        });
    });

    // Obtener fotos de un evento específico (solo si galería publicada)
    getByEventId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const event = await this.eventModel.getById(eventId);

        if (!event) {
            throw new NotFoundError("Event not found");
        }

        // Solo permitir acceso a galerías publicadas
        if (event.galleryStatus !== 'PUBLISHED') {
            throw new NotFoundError("La galería de este evento no está disponible.");
        }

        const photos = await this.model.getByEventId(Number(eventId));
        return res.status(200).send({
            success: true,
            data: photos
        });
    });

    // Obtener todos los eventos con galerías publicadas
    getEventsWithPublishedGalleries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const allEvents = await this.eventModel.getAll();

        if (!allEvents || allEvents.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No hay galerías disponibles",
                data: []
            });
        }

        const publishedEvents = allEvents.filter(event => event.galleryStatus === 'PUBLISHED');

        if (publishedEvents.length === 0) {
            return res.status(200).send({
                success: true,
                message: "No hay galerías publicadas",
                data: []
            });
        }

        const galleries = publishedEvents.map(event => toGalleryEventDTO(event));

        return res.status(200).send({
            success: true,
            data: galleries
        });
    });

    // Eliminar todas las fotos de un evento
    deleteByEventId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { eventId } = req.params;
        const event = await this.eventModel.getById(eventId);
        if (!event) {
            throw new NotFoundError("Event not found");
        }

        const photos = await this.model.getByEventId(Number(eventId));
        if (photos.length === 0) {
            throw new NotFoundError("No se encontraron fotos para este evento");
        }

        // Eliminar de Cloudinary
        for (const photo of photos) {
            try {
                await cloudinary.uploader.destroy(photo.publicId);
            } catch (error) {
                console.error(`Error deleting photo ${photo.publicId} from Cloudinary:`, error);
            }
        }

        // Eliminar de la base de datos
        await this.model.deleteByEventId(Number(eventId));

        return res.status(200).send({
            success: true,
            message: `${photos.length} fotos eliminadas exitosamente`
        });
    });
}
