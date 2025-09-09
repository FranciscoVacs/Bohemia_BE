import { Router } from "express";
import { TicketTypeController } from "../controllers/ticketType.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateTicketTypeSchema, UpdateTicketTypeSchema } from "../schemas/ticketType.schema.js";
import type { TicketType } from "../entities/ticketType.entity.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";
import type { ITicketTypeModel } from "../interfaces/ticketType.interface.js";

export const ticketTypeRouter = Router();

export const createTicketTypeRouter = ({
  ticketTypeModel,
}: {
  ticketTypeModel: ITicketTypeModel<TicketType>;
}) => {
  const ticketTypeController = new TicketTypeController(ticketTypeModel);

  ticketTypeRouter.get("/", ticketTypeController.getAll);
  ticketTypeRouter.get("/:id", schemaValidator(UpdateTicketTypeSchema), ticketTypeController.getById);
  ticketTypeRouter.post("/", verifyToken, isAdmin,   schemaValidator(CreateTicketTypeSchema), ticketTypeController.create);
  ticketTypeRouter.patch("/:id",verifyToken, isAdmin, schemaValidator(UpdateTicketTypeSchema), ticketTypeController.update);
  ticketTypeRouter.delete("/:id",verifyToken, isAdmin, schemaValidator(UpdateTicketTypeSchema), ticketTypeController.delete);

  return ticketTypeRouter;
};
