import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreatePurchaseSchema, UpdatePurchaseSchema } from "../schemas/purchase.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Purchase } from "../entities/purchase.entity.js";

export const purchaseRouter = Router();

export const createPurchaseRouter = ({
  purchaseModel,
}: {
  purchaseModel: IModel<Purchase>;
}) => {
  const purchaseController = new PurchaseController(purchaseModel);

  purchaseRouter.get("/", purchaseController.getAll);
  purchaseRouter.get("/:id", schemaValidator(UpdatePurchaseSchema), purchaseController.getById);
  purchaseRouter.post("/", schemaValidator(CreatePurchaseSchema), purchaseController.create);
  purchaseRouter.patch("/:id", schemaValidator(UpdatePurchaseSchema), purchaseController.update);
  purchaseRouter.delete("/:id", schemaValidator(UpdatePurchaseSchema), purchaseController.delete);

  return purchaseRouter;
};
