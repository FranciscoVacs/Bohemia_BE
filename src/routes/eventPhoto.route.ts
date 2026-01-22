import { Router } from "express";
import { EventPhotoController } from "../controllers/eventPhoto.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { UploadEventPhotoSchema, UpdateEventPhotoSchema } from "../schemas/eventPhoto.schema.js";
import type { IEventPhotoModel } from "../interfaces/eventPhoto.interface.js";
import type { EventPhoto } from "../entities/eventPhoto.entity.js";
import { verifyToken, isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { EventModel } from "../models/orm/event.model.js";

export const eventPhotoRouter = Router();

export const createEventPhotoRouter = ({
    eventPhotoModel,
    eventModel
}: {
    eventPhotoModel: IEventPhotoModel<EventPhoto>;
    eventModel: EventModel;
}) => {
    const eventPhotoController = new EventPhotoController(eventPhotoModel, eventModel);

    // ================================
    // Rutas PÚBLICAS (sin autenticación)
    // ================================

    // Listar todos los eventos con galerías publicadas
    eventPhotoRouter.get("/galleries", eventPhotoController.getEventsWithPublishedGalleries);

    // Obtener fotos de un evento específico (solo si galería publicada)
    eventPhotoRouter.get("/gallery/:eventId", isAuthenticated, eventPhotoController.getByEventId);

    // ================================
    // Rutas protegidas (requieren autenticación y admin)
    // ================================
    eventPhotoRouter.get("/", verifyToken, isAdmin, eventPhotoController.getAll);

    // Upload de fotos
    eventPhotoRouter.post("/upload/:eventId",
        verifyToken,
        isAdmin,
        schemaValidator(UploadEventPhotoSchema),
        eventPhotoController.uploadPhotos
    );

    eventPhotoRouter.put("/:id",
        verifyToken,
        isAdmin,
        schemaValidator(UpdateEventPhotoSchema),
        eventPhotoController.update
    );

    eventPhotoRouter.delete("/:id",
        verifyToken,
        isAdmin,
        schemaValidator(UploadEventPhotoSchema),
        eventPhotoController.delete
    );

    // Eliminar todas las fotos de un evento
    eventPhotoRouter.delete("/event/:eventId",
        verifyToken,
        isAdmin,
        eventPhotoController.deleteByEventId
    );

    return eventPhotoRouter;
};
