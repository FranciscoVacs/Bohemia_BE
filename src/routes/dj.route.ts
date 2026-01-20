import { Router } from "express";
import { DjController } from "../controllers/dj.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateDjSchema, UpdateDjSchema } from "../schemas/dj.schema.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Dj } from "../entities/dj.entity.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

export const djRouter = Router();

export const createDjRouter = ({
  djModel,
}: {
  djModel: IModel<Dj>;
}) => {
  const djController = new DjController(djModel);

  // Rutas administrativas (requieren autenticación y admin)
  djRouter.get("/", verifyToken, isAdmin, djController.getAll);
  djRouter.get("/:id", verifyToken, isAdmin, schemaValidator(UpdateDjSchema), djController.getById);

  // Rutas administrativas (requieren autenticación y admin)
  djRouter.post("/", verifyToken, isAdmin, schemaValidator(CreateDjSchema), djController.create);
  djRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdateDjSchema), djController.update);
  djRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdateDjSchema), djController.delete);

  return djRouter;
};
