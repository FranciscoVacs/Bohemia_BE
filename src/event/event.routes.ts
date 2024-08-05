import { Router } from "express";

import {
  sanitizeEventsInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from "./event.controler.js";

export const eventRouter = Router();

eventRouter.get("/", findAll);
eventRouter.get("/:id", findOne);
eventRouter.post("/", sanitizeEventsInput, add);
eventRouter.put("/:id",sanitizeEventsInput, update);
eventRouter.patch("/:id",sanitizeEventsInput, update);
eventRouter.delete("/:id", remove);
