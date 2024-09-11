import { Router } from "express";
import { LocationController } from "../controllers/location.controller.js";
import type { ILocationModel } from "../interfaces/location.model.interface.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import {
  CreateLocationSchema,
  UpdateLocationSchema,
} from "../schemas/location.schema.js";

export const locationRouter = Router();

export const createLocationRouter = ({
  locationModel,
}: {
  locationModel: ILocationModel;
}) => {
  const locationRouter = Router();
  const locationController = new LocationController(locationModel);

  locationRouter.get("/", locationController.getAll);
  locationRouter.get(
    "/:id",
    schemaValidator(UpdateLocationSchema),
    locationController.getById,
  );

  locationRouter.post(
    "/",
    schemaValidator(CreateLocationSchema),
    locationController.create,
  );
  locationRouter.patch(
    "/:id",
    schemaValidator(UpdateLocationSchema),
    locationController.update,
  );
  locationRouter.delete(
    "/:id",
    schemaValidator(UpdateLocationSchema),
    locationController.delete,
  );

  return locationRouter;
};
