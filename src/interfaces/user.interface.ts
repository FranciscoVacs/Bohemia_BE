import type { IModel } from "./model.interface";
import type { Ticket } from "../entities/ticket.entity";

export interface IUserModel<T> extends IModel<T> {
  getByEmail(email: string): Promise<T | null>;
  showTickets(id: string): Promise<T | null>;
}

