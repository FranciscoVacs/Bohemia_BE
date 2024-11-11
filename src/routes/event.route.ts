import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateEventSchema, UpdateEventSchema } from "../schemas/event.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Event } from "../entities/event.entity.js";
import { verifyToken } from "../middlewares/auth.js";
import { uploader } from "../middlewares/uploadFile.js";  
import { parseFormData } from "../middlewares/parseFormData.js";


export const eventRouter = Router();

export const createEventRouter = ({
  eventModel,
}: {
  eventModel: IModel<Event>;
}) => {
  const eventController = new EventController(eventModel);

  eventRouter.get("/", eventController.getAll);
  eventRouter.get("/:id", schemaValidator(UpdateEventSchema), eventController.getById);
  eventRouter.post("/", uploader, parseFormData, schemaValidator(CreateEventSchema), eventController.create);
  eventRouter.patch("/:id", schemaValidator(UpdateEventSchema),verifyToken, eventController.update);
  eventRouter.delete("/:id", schemaValidator(UpdateEventSchema), eventController.delete);

  return eventRouter;
};
