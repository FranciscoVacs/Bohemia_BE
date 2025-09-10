import type { IModel } from "./model.interface";
import type { Ticket } from "../entities/ticket.entity";
import { Purchase } from "../entities/purchase.entity.js";

export interface IUserModel<T> extends IModel<T> {
  getByEmail(email: string): Promise<T | null>;
  getUserPurchases(id: string): Promise<Purchase[] | null>;
}

