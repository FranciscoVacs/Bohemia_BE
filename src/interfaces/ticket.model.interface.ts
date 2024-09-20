import type { Ticket } from "../entities/ticket.entity";

export interface ITicketModel {
  getAll(): Promise<Ticket[] | undefined>;
  getById(id: string): Promise<Ticket | undefined>;
  create(ticket: Ticket): Promise<Ticket | undefined>;
  update(id: string, ticket: Partial<Ticket>): Promise<void>;
  delete(id: string): Promise<void>;
}