import type { EventImage } from "../entities/eventImage.entity.js";
import type { IEventImageModel } from "../interfaces/eventImage.interface";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { NotFoundError } from "../shared/errors/AppError.js";
import { EventModel } from "../models/orm/event.model.js";
import uploadEventImage from "../middlewares/uploadEventImage.js";
import { RequiredEntityData } from "@mikro-orm/core";

export class EventImageController extends BaseController<EventImage> {
  constructor(protected model: IEventImageModel<EventImage>, private eventModel: EventModel) {
    super(model);
  }
  uploadImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { eventId } = req.params; // Ya convertido por schema a number    // 1. Verificar que el evento existe
    const event = await this.eventModel.getById(eventId);
    if (!event) {
        throw new NotFoundError("Event not found");
    }

    // 2. Crear middleware dinámico para subir a carpeta específica
    const uploadMiddleware = uploadEventImage(`events/${event.eventName.trim()}`).array('images', 10);

    // 3. Ejecutar el middleware (AQUÍ SE SUBE A CLOUDINARY)
    uploadMiddleware(req, res, async (err: any) => {
        if (err) {
            throwError.badRequest(`Upload error: ${err.message}`);
            return;
        }

        // 4. Los archivos YA están en Cloudinary!
        const files = req.files as Express.Multer.File[];
        
        if (!files || files.length === 0) {
            throwError.badRequest("No images uploaded");
            return;
        }

        // 5. Guardar referencias en la base de datos
        const imageEntries = [];
        for (const file of files) {
            const imageData = {
                event: +eventId,                       // ← Convertido a number
                cloudinaryUrl: file.path,              // ← URL de Cloudinary
                publicId: file.filename,      // ← Public ID
                originalName: file.originalname,
            }as RequiredEntityData<EventImage>;
            
            const image = await this.model.create(imageData);
            imageEntries.push(image);
        }

        return res.status(201).send({
            success: true,
            message: `${files.length} images uploaded successfully`,
            data: imageEntries
        });
    });
});

getByEventId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { eventId } = req.params;
    const event = await this.eventModel.getById(eventId);
    if (!event) {
        throw new NotFoundError("Event not found");
    }

    const images = await this.model.getByEventId(Number(eventId));
    return res.status(200).send({
        success: true,
        data: images
    });
});

deleteByEventId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { eventId } = req.params;
    const event = await this.eventModel.getById(eventId);
    if (!event) {
        throw new NotFoundError("Event not found");
    }

    const images = await this.model.getByEventId(Number(eventId));
    if (images.length === 0) {
        throw new NotFoundError("No images found for this event");
    }

    // Eliminar de Cloudinary
    for (const image of images) {
        try {
            await cloudinary.uploader.destroy(image.publicId);
        } catch (error) {
            console.error(`Error deleting image ${image.publicId} from Cloudinary:`, error);
        }
    }

    // Eliminar de la base de datos
    await this.model.deleteByEventId(Number(eventId));

    return res.status(200).send({
        success: true,
        message: `${images.length} images deleted successfully`
    });
});
}