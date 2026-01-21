import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreatePurchaseSchema, UpdatePurchaseSchema } from "../schemas/purchase.schema.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Purchase } from "../entities/purchase.entity.js";
import { isAdmin, isAuthenticated, verifyToken } from "../middlewares/auth.js";
import { PurchaseModel } from "../models/orm/purchase.model.js";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";

export const purchaseRouter = Router();

export const createPurchaseRouter = ({
  purchaseModel,
}: {
  purchaseModel: IPurchaseModel<Purchase>;// 👈 Inject the user model, para los nuevos metodos
}) => {
  const purchaseController = new PurchaseController(purchaseModel);

  // Rutas para generar PDF de tickets (verificación de propiedad en controller)
  purchaseRouter.get("/:purchaseId/ticket/:ticketId", verifyToken, /*schemaValidator(UpdatePurchaseSchema)*/ purchaseController.getById);

  // Rutas de creación (requieren autenticación)
  purchaseRouter.post("/", verifyToken, schemaValidator(CreatePurchaseSchema), purchaseController.create);

  // Rutas administrativas (solo admin puede ver/modificar todas las compras)
  purchaseRouter.get("/", verifyToken, isAdmin, purchaseController.getAll);
  purchaseRouter.get("/:id", verifyToken, isAdmin, purchaseController.getTickets);
  purchaseRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdatePurchaseSchema), purchaseController.update);
  purchaseRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdatePurchaseSchema), purchaseController.delete);

  return purchaseRouter;
};
