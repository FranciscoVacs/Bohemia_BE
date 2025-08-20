import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateEventSchema, UpdateEventSchema } from "../schemas/event.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
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
  eventRouter.get("/", eventController.getAll);
  eventRouter.get("/future", eventController.getFutureEvents); // Nueva ruta para eventos futuros
  eventRouter.get("/:id", schemaValidator(UpdateEventSchema), eventController.getById);
  
  // Rutas protegidas (requieren autenticación y admin)
  eventRouter.post("/", verifyToken, isAdmin, uploader, schemaValidator(CreateEventSchema), eventController.create);
  eventRouter.patch("/:id", verifyToken, isAdmin, uploader, schemaValidator(UpdateEventSchema), eventController.update);
  eventRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdateEventSchema), eventController.delete);
  
  return eventRouter;
};
