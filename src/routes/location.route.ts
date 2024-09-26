import { Router } from "express";
import { LocationController } from "../controllers/location.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateLocationSchema, UpdateLocationSchema } from "../schemas/location.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Location } from "../entities/location.entity.js";

export const locationRouter = Router();

export const createLocationRouter = ({
  locationModel,
}: {
  locationModel: IModel<Location>;
}) => {
  const locationController = new LocationController(locationModel);

  locationRouter.get("/", locationController.getAll);
  locationRouter.get("/:id", schemaValidator(UpdateLocationSchema), locationController.getById);
  locationRouter.post("/", schemaValidator(CreateLocationSchema), locationController.create);
  locationRouter.patch("/:id", schemaValidator(UpdateLocationSchema), locationController.update);
  locationRouter.delete("/:id", schemaValidator(UpdateLocationSchema), locationController.delete);

  return locationRouter;
};
