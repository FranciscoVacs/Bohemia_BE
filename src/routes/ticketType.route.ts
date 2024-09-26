import { Router } from "express";
import { TicketTypeController } from "../controllers/ticketType.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateTicketTypeSchema, UpdateTicketTypeSchema } from "../schemas/ticketType.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { TicketType } from "../entities/ticketType.entity.js";

export const ticketTypeRouter = Router();

export const createTicketTypeRouter = ({
  ticketTypeModel,
}: {
  ticketTypeModel: IModel<TicketType>;
}) => {
  const ticketTypeController = new TicketTypeController(ticketTypeModel);

  ticketTypeRouter.get("/", ticketTypeController.getAll);
  ticketTypeRouter.get("/:id", schemaValidator(UpdateTicketTypeSchema), ticketTypeController.getById);
  ticketTypeRouter.post("/", schemaValidator(CreateTicketTypeSchema), ticketTypeController.create);
  ticketTypeRouter.patch("/:id", schemaValidator(UpdateTicketTypeSchema), ticketTypeController.update);
  ticketTypeRouter.delete("/:id", schemaValidator(UpdateTicketTypeSchema), ticketTypeController.delete);

  return ticketTypeRouter;
};
