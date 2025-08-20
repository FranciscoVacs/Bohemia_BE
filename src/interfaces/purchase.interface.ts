import type { IModel } from "./model.interface";

export interface IPurchaseModel<T> extends IModel<T> {
  createProtocol(ticketTypeId: string, ticketQuantity: number, userId: string): Promise<T | undefined>;
}