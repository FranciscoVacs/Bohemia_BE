import { Router } from "express";
import { EventoModel } from "../models/eventos.model.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateEventosSchema, UpdateEventosSchema } from "../schemas/eventos.schema.js";
import { EventoController } from "../controllers/eventos.controller.js";

export const  eventosRouter = Router();

export const createEventosRouter = ({ eventoModel }: { eventoModel: EventoModel }) => {
    const eventosRouter = Router();
    const eventoController = new EventoController(eventoModel);
  
    eventosRouter.get("/", eventoController.getAll);
    eventosRouter.get("/:id", eventoController.getById);
  
    eventosRouter.post("/", schemaValidator(CreateEventosSchema), eventoController.create);
    eventosRouter.patch("/:id", schemaValidator(UpdateEventosSchema), eventoController.update);
    eventosRouter.delete("/:id", eventoController.delete);
  
    return eventosRouter;
  };