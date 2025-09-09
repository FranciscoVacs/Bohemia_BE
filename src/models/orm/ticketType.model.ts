
import { TicketType } from "../../entities/ticketType.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";
import { Event } from "../../entities/event.entity.js";
import type { ITicketTypeModel } from "../../interfaces/ticketType.interface.js";

export class TicketTypeModel extends BaseModel<TicketType> implements ITicketTypeModel<TicketType> {
  constructor(em: EntityManager) {
    super(em, TicketType);
  }

  async getTotalMaxQuantityByEvent(eventId: number): Promise<number> {
    const ticketTypes = await this.em.find(TicketType, { event: eventId });
    return ticketTypes.reduce((total, ticketType) => total + ticketType.maxQuantity, 0);
  }

  async getEventWithLocation(eventId: number): Promise<Event | null> {
    return await this.em.findOne(Event, eventId, { populate: ['location'] });
  }

}