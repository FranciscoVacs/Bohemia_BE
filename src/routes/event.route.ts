import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateEventSchema, UpdateEventSchema } from "../schemas/event.schema.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Event } from "../entities/event.entity.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";
import { uploader } from "../middlewares/uploadFile.js";


export const eventRouter = Router();

export const createEventRouter = ({
  eventModel,
}: {
  eventModel: IModel<Event>;
}) => {
  const eventController = new EventController(eventModel);

  // Rutas públicas
  eventRouter.get("/future", eventController.getFutureEvents); // Nueva ruta para eventos futuros

  // Rutas protegidas (requieren autenticación y admin)
  eventRouter.get("/admin", verifyToken, isAdmin, eventController.getAllForAdmin); // Con métricas calculadas
  eventRouter.get("/admin/:id", verifyToken, isAdmin, eventController.getByIdForAdmin); // Nuevo: detalle completo para admin

  // Rutas públicas
  eventRouter.get("/:id", schemaValidator(UpdateEventSchema), eventController.getById);
  eventRouter.get("/:id/ticketTypes", schemaValidator(UpdateEventSchema), eventController.getTicketTypes); // Ticket types por evento

  // Rutas protegidas (requieren autenticación y admin)
  eventRouter.post("/crear", verifyToken, isAdmin, uploader, schemaValidator(CreateEventSchema), eventController.create);
  eventRouter.patch("/:id", verifyToken, isAdmin, uploader, schemaValidator(UpdateEventSchema), eventController.update);
  eventRouter.patch("/:id/gallery-status", verifyToken, isAdmin, eventController.updateGalleryStatus);
  eventRouter.patch("/:id/publish", verifyToken, isAdmin, eventController.publishEvent);
  eventRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdateEventSchema), eventController.delete);

  return eventRouter;
};
