import { Router } from "express";
import { DjController } from "../controllers/dj.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateDjSchema, UpdateDjSchema } from "../schemas/dj.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Dj } from "../entities/dj.entity.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

export const djRouter = Router();

export const createDjRouter = ({
  djModel,
}: {
  djModel: IModel<Dj>;
}) => {
  const djController = new DjController(djModel);

  djRouter.get("/", djController.getAll);
  djRouter.get("/:id", schemaValidator(UpdateDjSchema), djController.getById);
  djRouter.post("/",schemaValidator(CreateDjSchema), djController.create);
  djRouter.patch("/:id",   schemaValidator(UpdateDjSchema), djController.update);
  djRouter.delete("/:id",   schemaValidator(UpdateDjSchema), djController.delete);

  return djRouter;
};
