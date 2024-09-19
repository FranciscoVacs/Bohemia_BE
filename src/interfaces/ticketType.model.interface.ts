import type { TicketType } from "../entities/ticketType.entity";

export interface ITicketTypeModel {
  getAll(): Promise<TicketType[] | undefined>;
  getById(id: string): Promise<TicketType | undefined>;
  create(ticketType: TicketType): Promise<TicketType | undefined>;
  update(id: string, ticketType: Partial<TicketType>): Promise<void>;
  delete(id: string): Promise<void>;
}