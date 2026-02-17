import type { IModel } from "./model.interface.js";
import type { Event } from "../entities/event.entity.js";
import type { TicketType } from "../entities/ticketType.entity.js";

export interface ITicketTypeModel<T> extends IModel<T> {
  getTotalMaxQuantityByEvent(eventId: number): Promise<number>;
  getEventWithLocation(eventId: number): Promise<Event | null>;
  activateNext(eventId: number): Promise<TicketType | null>;
  closeTicketType(ticketTypeId: string): Promise<TicketType>;
  hasActiveTicketType(eventId: number): Promise<boolean>;
}
