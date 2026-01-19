import { Event } from "../../entities/event.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class EventModel extends BaseModel<Event> {
  constructor(protected readonly em: EntityManager) {
    super(em, Event);
  }

  async getAll(): Promise<Event[] | undefined> {
    return await this.em.find(Event, {}, {
      populate: ["location", "location.city", "dj"]
    });
  }

  async getById(id: string): Promise<Event | undefined> {
    const parsedId = Number.parseInt(id);
    const item = await this.em.findOneOrFail(Event, parsedId, {
      populate: ["location", "location.city", "ticketType", "dj"]
    });
    return item;
  }

}