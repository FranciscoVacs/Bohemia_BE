import { Router } from "express";
import { EventGalleryController } from "../controllers/eventGallery.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { UploadEventGallerySchema, UpdateEventGallerySchema } from "../schemas/eventGallery.schema.js";
import type { IEventGalleryModel } from "../interfaces/eventGallery.interface.js";
import type { EventGallery } from "../entities/eventGallery.entity.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";
import { EventModel } from "../models/orm/event.model.js";

export const eventGalleryRouter = Router();

export const createEventGalleryRouter = ({
    eventGalleryModel,
    eventModel
}: {
    eventGalleryModel: IEventGalleryModel<EventGallery>;
    eventModel: EventModel;
}) => {
    const eventGalleryController = new EventGalleryController(eventGalleryModel, eventModel);

    // Rutas públicas - Galería visible sin login
    eventGalleryRouter.get("/:eventId", eventGalleryController.getByEventId);

    // Rutas protegidas (requieren autenticación y admin)
    eventGalleryRouter.get("/", verifyToken, isAdmin, eventGalleryController.getAll);
    eventGalleryRouter.get("/image/:id", verifyToken, isAdmin, eventGalleryController.getById);

    // Ruta especial para upload - usa middleware de Cloudinary
    eventGalleryRouter.post("/upload/:eventId",
        verifyToken,
        isAdmin,
        schemaValidator(UploadEventGallerySchema),
        eventGalleryController.uploadImages
    );

    eventGalleryRouter.put("/:id",
        verifyToken,
        isAdmin,
        schemaValidator(UpdateEventGallerySchema),
        eventGalleryController.update
    );

    eventGalleryRouter.delete("/:id",
        verifyToken,
        isAdmin,
        schemaValidator(UploadEventGallerySchema),
        eventGalleryController.delete
    );

    // Ruta para eliminar todas las imágenes de un evento
    eventGalleryRouter.delete("/event/:eventId",
        verifyToken,
        isAdmin,
        eventGalleryController.deleteByEventId
    );

    return eventGalleryRouter;
};
