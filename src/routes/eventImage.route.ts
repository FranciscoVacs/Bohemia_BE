import { Router } from "express";
import { EventImageController } from "../controllers/eventImage.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { UploadEventImageSchema, UpdateEventImageSchema } from "../schemas/eventImage.schema.js";
import type { IEventImageModel } from "../interfaces/eventImage.interface.js";
import type { EventImage } from "../entities/eventImage.entity.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";
import { EventModel } from "../models/orm/event.model.js";

export const eventImageRouter = Router();

export const createEventImageRouter = ({
  eventImageModel,
  eventModel
}: {
  eventImageModel: IEventImageModel<EventImage>;
  eventModel: EventModel;
}) => {
  const eventImageController = new EventImageController(eventImageModel, eventModel);
  
  // Rutas para usuarios autenticados
  eventImageRouter.get("/:eventId", verifyToken, eventImageController.getByEventId);
  eventImageRouter.get("/:id", verifyToken, eventImageController.getById); // Obtener imagen específica
  
  // Rutas protegidas (requieren autenticación y admin)
  eventImageRouter.get("/", verifyToken, isAdmin, eventImageController.getAll); // Todas las imágenes

  
  // Ruta especial para upload - usa middleware de Cloudinary
  eventImageRouter.post("/upload/:eventId", 
    verifyToken, 
    isAdmin, 
    schemaValidator(UploadEventImageSchema), 
    eventImageController.uploadImages
  );
  
  eventImageRouter.put("/:id", 
    verifyToken, 
    isAdmin, 
    schemaValidator(UpdateEventImageSchema), 
    eventImageController.update
  );
  
  eventImageRouter.delete("/:id", 
    verifyToken, 
    isAdmin, 
    schemaValidator(UploadEventImageSchema), 
    eventImageController.delete
  );

  // Nueva ruta para eliminar todas las imágenes de un evento
  eventImageRouter.delete("/event/:eventId", 
    verifyToken, 
    isAdmin, 
    eventImageController.deleteByEventId
  );

  return eventImageRouter;
};