import { Router } from "express";
import { CityController } from "../controllers/city.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateCitySchema, UpdateCitySchema } from "../schemas/city.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { City } from "../entities/city.entity.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

export const cityRouter = Router();

export const createCityRouter = ({
  cityModel,
}: {
  cityModel: IModel<City>;
}) => {
  const cityController = new CityController(cityModel);

  // Rutas públicas
  cityRouter.get("/", cityController.getAll);
  cityRouter.get("/:id", schemaValidator(UpdateCitySchema), cityController.getById);
  
  // Rutas administrativas (requieren autenticación y admin)
  cityRouter.post("/", verifyToken, isAdmin, schemaValidator(CreateCitySchema), cityController.create);
  cityRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdateCitySchema), cityController.update);
  cityRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdateCitySchema), cityController.delete);

  return cityRouter;
};
