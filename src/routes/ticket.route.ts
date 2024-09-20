import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller.js";
import type { ITicketModel } from "../interfaces/ticket.model.interface.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import {
  CreateTicketSchema,
  UpdateTicketSchema,
} from "../schemas/ticket.schema.js";

export const ticketRouter = Router();

export const createTicketRouter = ({
  ticketModel,
}: {
  ticketModel: ITicketModel;
}) => {
  const ticketRouter = Router();
  const ticketController = new TicketController(ticketModel);

  ticketRouter.get("/", ticketController.getAll);
  ticketRouter.get(
    "/:id",
    schemaValidator(UpdateTicketSchema),
    ticketController.getById,
  );

  ticketRouter.post(
    "/",
    schemaValidator(CreateTicketSchema),
    ticketController.create,
  );
  ticketRouter.patch(
    "/:id",
    schemaValidator(UpdateTicketSchema),
    ticketController.update,
  );
  ticketRouter.delete(
    "/:id",
    schemaValidator(UpdateTicketSchema),
    ticketController.delete,
  );

  return ticketRouter;
};
