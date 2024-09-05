import { Router } from "express";
import { EventoController } from "../controllers/eventos.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import type { IEventoModel } from "../interfaces/eventos.model.interface.js";
import {
  CreateEventosSchema,
  UpdateEventosSchema,
} from "../schemas/eventos.schema.js";

export const eventosRouter = Router();

export const createEventosRouter = ({
  eventoModel,
}: {
  eventoModel: IEventoModel;
}) => {
  const eventosRouter = Router();
  const eventoController = new EventoController(eventoModel);

  eventosRouter.get("/", eventoController.getAll);
  eventosRouter.get("/:id", eventoController.getById);

  eventosRouter.post(
    "/",
    schemaValidator(CreateEventosSchema),
    eventoController.create,
  );
  eventosRouter.patch(
    "/:id",
    schemaValidator(UpdateEventosSchema),
    eventoController.update,
  );
  eventosRouter.delete("/:id", eventoController.delete);

  return eventosRouter;
};
