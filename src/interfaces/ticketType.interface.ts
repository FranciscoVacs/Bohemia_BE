import type { IModel } from "./model.interface.js";
import type { Event } from "../entities/event.entity.js";

export interface ITicketTypeModel<T> extends IModel<T> {
  getTotalMaxQuantityByEvent(eventId: number): Promise<number>;
  getEventWithLocation(eventId: number): Promise<Event | null>;
}
