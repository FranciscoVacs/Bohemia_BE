import type { IModel } from "./model.interface";
import type { PaymentStatus, Purchase } from "../entities/purchase.entity";

export interface IPurchaseModel<T> extends IModel<T> {
  // Crear compra con tickets inmediatamente
  createPurchase(
    ticketTypeId: string,
    ticketQuantity: number,
    userId: string
  ): Promise<T>;

  updatePaymentStatus(
    purchaseId: string,
    status: PaymentStatus,
  ): Promise<T>;
}