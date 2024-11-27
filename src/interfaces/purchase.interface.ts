import type { IModel } from "./model.interface";

export interface IPurchaseModel<T> extends IModel<T> {
  createProtocol(ticketType_id:string, ticket_quantity:number, user_id:string): Promise<T | undefined>;
}