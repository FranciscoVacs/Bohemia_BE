import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreatePurchaseSchema, UpdatePurchaseSchema } from "../schemas/purchase.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Purchase } from "../entities/purchase.entity.js";
import { verifyToken, isAdmin, isAuthenticated } from "../middlewares/auth.js";

export const purchaseRouter = Router();

export const createPurchaseRouter = ({
  purchaseModel,
}: {
  purchaseModel: IModel<Purchase>;
}) => {
  const purchaseController = new PurchaseController(purchaseModel);

  purchaseRouter.get("/", verifyToken, purchaseController.getAll);
  purchaseRouter.get("/:id", verifyToken, isAdmin, schemaValidator(UpdatePurchaseSchema), purchaseController.getById);
  purchaseRouter.post("/", isAuthenticated, schemaValidator(CreatePurchaseSchema), purchaseController.create);
  purchaseRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdatePurchaseSchema), purchaseController.update);
  purchaseRouter.delete("/:id", verifyToken, isAdmin,schemaValidator(UpdatePurchaseSchema), purchaseController.delete);

  return purchaseRouter;
};
