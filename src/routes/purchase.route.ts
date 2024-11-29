import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreatePurchaseSchema, UpdatePurchaseSchema } from "../schemas/purchase.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { Purchase } from "../entities/purchase.entity.js";
import {     isAdmin, isAuthenticated, verifyToken } from "../middlewares/auth.js";
import { PurchaseModel } from "../models/orm/purchase.model.js";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";

export const purchaseRouter = Router();

export const createPurchaseRouter = ({
  purchaseModel,
}: {
  purchaseModel: IPurchaseModel<Purchase>;// 👈 Inject the user model, para los nuevos metodos
}) => {
  const purchaseController = new PurchaseController(purchaseModel);

  purchaseRouter.get("/", purchaseController.getAll);
  purchaseRouter.get("/:id", purchaseController.getTickets);
  purchaseRouter.get("/:purchaseId/ticket/:ticketId",/*schemaValidator(UpdatePurchaseSchema)*/ purchaseController.getById);
  purchaseRouter.post("/",   /*schemaValidator(CreatePurchaseSchema),*/ purchaseController.create);
  purchaseRouter.patch("/:id",     schemaValidator(UpdatePurchaseSchema), purchaseController.update);
  purchaseRouter.delete("/:id",   schemaValidator(UpdatePurchaseSchema), purchaseController.delete);

  return purchaseRouter;
};
