import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreatePurchaseSchema, UpdatePurchaseSchema } from "../schemas/purchase.schema.js";
import type { Purchase } from "../entities/purchase.entity.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";

export const purchaseRouter = Router();

export const createPurchaseRouter = ({
  purchaseModel,
}: {
  purchaseModel: IPurchaseModel<Purchase>;
}) => {
  const purchaseController = new PurchaseController(purchaseModel);

  // =====================
  // Rutas de compra
  // =====================


  purchaseRouter.post("/create_preference", 
    verifyToken,
    purchaseController.createPreference);

  purchaseRouter.post("/payments/webhook", purchaseController.handlePaymentWebhook);

  // Crear compra (genera tickets inmediatamente)
  purchaseRouter.post("/",
    verifyToken,
    schemaValidator(CreatePurchaseSchema),
    purchaseController.createPurchase
  );

  // Descargar PDF de ticket
  purchaseRouter.get("/:purchaseId/ticket/:ticketId",
    verifyToken,
    purchaseController.getById
  );

  // =====================
  // Rutas administrativas
  // =====================

  purchaseRouter.get("/", verifyToken, isAdmin, purchaseController.getAll);
  purchaseRouter.get("/:id", verifyToken, isAdmin, purchaseController.getTickets);
  purchaseRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdatePurchaseSchema), purchaseController.update);
  purchaseRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdatePurchaseSchema), purchaseController.delete);

  return purchaseRouter;
};
