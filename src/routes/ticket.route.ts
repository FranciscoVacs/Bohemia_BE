import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateTicketSchema, UpdateTicketSchema } from "../schemas/ticket.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Ticket } from "../entities/ticket.entity.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

export const ticketRouter = Router();

export const createTicketRouter = ({
  ticketModel,
}: {
  ticketModel: IModel<Ticket>;
}) => {
  const ticketController = new TicketController(ticketModel);

  // Rutas administrativas (solo admin puede gestionar tickets directamente)
  ticketRouter.get("/", verifyToken, isAdmin, ticketController.getAll);
  ticketRouter.get("/:id", verifyToken, isAdmin, schemaValidator(UpdateTicketSchema), ticketController.getById);
  ticketRouter.post("/", verifyToken, isAdmin, schemaValidator(CreateTicketSchema), ticketController.create);
  ticketRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdateTicketSchema), ticketController.update);
  ticketRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdateTicketSchema), ticketController.delete);

  return ticketRouter;
};
