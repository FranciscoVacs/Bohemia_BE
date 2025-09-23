import type { Gallery } from "../entities/gellery.entity.js";
import type { IGalleryModel } from "../interfaces/gallery.interface.js";
import type { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller.js";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { NotFoundError } from "../shared/errors/AppError.js";
import { EventModel } from "../models/orm/event.model.js";
import uploadGallery from "../middlewares/uploadGallery.js";
import { RequiredEntityData } from "@mikro-orm/core";

export class GalleryController extends BaseController<Gallery> {
  constructor(protected model: IGalleryModel<Gallery>, private eventModel: EventModel) {
    super(model);
  }
  uploadImages = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { eventId } = req.params; // Ya convertido por schema a number    // 1. Verificar que el evento existe
    const event = await this.eventModel.getById(eventId);
    if (!event) {
        throw new NotFoundError("Event not found");
    }

    // 2. Crear middleware dinámico para subir a carpeta específica
    const uploadMiddleware = uploadGallery(`events/${event.eventName.trim()}`).array('images', 10);

    // 3. Ejecutar el middleware (AQUÍ SE SUBE A CLOUDINARY)
    uploadMiddleware(req, res, async (err) => {
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
        const galleryEntries = [];
        for (const file of files) {
            const galleryData = {
                event: +eventId,                       // ← Convertido a number
                cloudinaryUrl: file.path,              // ← URL de Cloudinary
                publicId: file.filename,      // ← Public ID
                originalName: file.originalname,
                createdAt: new Date(),
                updatedAt: new Date(),
            }as RequiredEntityData<Gallery>;
            
            const gallery = await this.model.create(galleryData);
            galleryEntries.push(gallery);
        }

        return res.status(201).send({
            success: true,
            message: `${files.length} images uploaded successfully`,
            data: galleryEntries
        });
    });
});

getByEventId = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { eventId } = req.params;
    const event = await this.eventModel.getById(eventId);
    if (!event) {
        throw new NotFoundError("Event not found");
    }

    const gallery = await this.model.getByEventId(Number(eventId));
    return res.status(200).send({
        success: true,
        data: gallery
    });
});}