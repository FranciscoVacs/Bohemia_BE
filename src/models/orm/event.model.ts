import type { IEventModel } from "../../interfaces/event.model.interface.js";
import { Event } from "../../entities/event.entity.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class EventModel implements IEventModel {
  constructor(private em: EntityManager) {}

  async getAll(): Promise<Event[] | undefined> {
    return await this.em.find(Event, {});
  }

  async getById(id: string): Promise<Event | undefined> {
    const parsedId = Number.parseInt(id);
    return await this.em.findOneOrFail(Event, parsedId, { populate: ["location", "location.city"] });
  }

  async create(eventInput: Event): Promise<Event | undefined> {
    const event = this.em.create(Event, eventInput);
    await this.em.flush();
    return event;
  }

  async delete(id: string): Promise<void> {
    const parsedId = Number.parseInt(id);
    const event = await this.em.findOneOrFail(Event, parsedId);
    await this.em.removeAndFlush(event);
  }

  async update(id: string, eventUpdates: Partial<Event>): Promise<void> {
    const parsedId = Number.parseInt(id);
    const eventToUpdate = await this.em.findOneOrFail(Event, parsedId);
    this.em.assign(eventToUpdate, eventUpdates);
    await this.em.flush();
  }
}
