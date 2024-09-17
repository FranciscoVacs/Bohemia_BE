import { Router } from "express";
import { EventController } from "../controllers/event.controller.js";
import type { IEventModel } from "../interfaces/event.model.interface.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import {
  CreateEventSchema,
  UpdateEventSchema,
} from "../schemas/event.schema.js";

export const eventRouter = Router();

export const createEventRouter = ({
  eventModel,
}: {
  eventModel: IEventModel;
}) => {
  const eventRouter = Router();
  const eventController = new EventController(eventModel);

  eventRouter.get("/", eventController.getAll);
  eventRouter.get(
    "/:id",
    schemaValidator(UpdateEventSchema),
    eventController.getById,
  );

  eventRouter.post(
    "/",
    schemaValidator(CreateEventSchema),
    eventController.create,
  );
  eventRouter.patch(
    "/:id",
    schemaValidator(UpdateEventSchema),
    eventController.update,
  );
  eventRouter.delete(
    "/:id",
    schemaValidator(UpdateEventSchema),
    eventController.delete,
  );

  return eventRouter;
};
