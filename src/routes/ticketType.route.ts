import { Router } from "express";
import { TicketTypeController } from "../controllers/ticketType.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateTicketTypeSchema, UpdateTicketTypeSchema } from "../schemas/ticketType.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { TicketType } from "../entities/ticketType.entity.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

export const ticketTypeRouter = Router();

export const createTicketTypeRouter = ({
  ticketTypeModel,
}: {
  ticketTypeModel: IModel<TicketType>;
}) => {
  const ticketTypeController = new TicketTypeController(ticketTypeModel);

  ticketTypeRouter.get("/", ticketTypeController.getAll);
  ticketTypeRouter.get("/:id", schemaValidator(UpdateTicketTypeSchema), ticketTypeController.getById);
  ticketTypeRouter.post("/", verifyToken, isAdmin, schemaValidator(CreateTicketTypeSchema), ticketTypeController.create);
  ticketTypeRouter.patch("/:id",verifyToken, isAdmin, schemaValidator(UpdateTicketTypeSchema), ticketTypeController.update);
  ticketTypeRouter.delete("/:id",verifyToken, isAdmin, schemaValidator(UpdateTicketTypeSchema), ticketTypeController.delete);

  return ticketTypeRouter;
};
