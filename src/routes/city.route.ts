import { Router } from "express";
import { CityController } from "../controllers/city.controller.js";
import type { ICityModel } from "../interfaces/city.model.interface.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateCitySchema, UpdateCitySchema } from "../schemas/city.schema.js";

export const cityRouter = Router();

export const createCityRouter = ({
  cityModel,
}: {
  cityModel: ICityModel;
}) => {
  const cityRouter = Router();
  const cityController = new CityController(cityModel);

  cityRouter.get("/", cityController.getAll);
  cityRouter.get(
    "/:id",
    schemaValidator(UpdateCitySchema),
    cityController.getById,
  );

  cityRouter.post(
    "/",
    schemaValidator(CreateCitySchema),
    cityController.create,
  );
  cityRouter.patch(
    "/:id",
    schemaValidator(UpdateCitySchema),
    cityController.update,
  );
  cityRouter.delete(
    "/:id",
    schemaValidator(UpdateCitySchema),
    cityController.delete,
  );

  return cityRouter;
};
