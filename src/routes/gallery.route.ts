import { Router } from "express";
import { GalleryController } from "../controllers/gallery.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { UploadGallerySchema, UpdateGallerySchema, DeleteGallerySchema } from "../schemas/gallery.schema.js";
import type { IGalleryModel } from "../interfaces/gallery.interface.js";
import type { Gallery } from "../entities/gellery.entity.js"; // Nota: tu archivo se llama "gellery" con 2 'l'
import { verifyToken, isAdmin } from "../middlewares/auth.js";
import { EventModel } from "../models/orm/event.model.js";

export const galleryRouter = Router();

export const createGalleryRouter = ({
  galleryModel,
  eventModel
}: {
  galleryModel: IGalleryModel<Gallery>;
  eventModel: EventModel;
}) => {
  const galleryController = new GalleryController(galleryModel, eventModel);
  
  // Rutas públicas
  galleryRouter.get("/:eventId", verifyToken, galleryController.getByEventId); // TODO: Implementar método
  galleryRouter.get("/:id", verifyToken, galleryController.getById); // Obtener imagen específica
  
  // Rutas protegidas (requieren autenticación y admin)
  galleryRouter.get("/", verifyToken, isAdmin, galleryController.getAll); // Todas las imágenes
  
  // Ruta especial para upload - usa middleware de Cloudinary
  galleryRouter.post("/upload/:eventId", 
    verifyToken, 
    isAdmin,
    schemaValidator(UploadGallerySchema),
    galleryController.uploadImages
  );
  
  galleryRouter.patch("/:id", 
    verifyToken, 
    isAdmin, 
    galleryController.update
  );
  
  // Ruta especial para delete - también elimina de Cloudinary
  galleryRouter.delete("/:id", 
    verifyToken, 
    isAdmin, // TODO: Implementar deleteWithCloudinary
  );
  
  return galleryRouter;
};