import { Event } from "../../entities/event.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class EventModel extends BaseModel<Event> {
  constructor(protected readonly em: EntityManager) {
    super(em, Event);
  }

  async getById(id: string): Promise<Event | undefined> {
    const parsedId = Number.parseInt(id);
    const item =  await this.em.findOneOrFail(Event, parsedId, {populate: ["location","location.city" ,"ticketType"]});
    return item;
  }

}