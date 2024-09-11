import type { IEventModel } from "../../interfaces/event.model.interface.js";
import {Event } from "../../entities/event.entity.js";
import type { EntityManager } from "@mikro-orm/mysql";


export class EventModel implements IEventModel{
    constructor(private em: EntityManager){}

    async getAll(): Promise<Event[] | undefined> {
        return await this.em.find(Event, {});
    }

    async getById(id: string): Promise<Event | undefined> {
        const parsedId = Number.parseInt(id);
        return await this.em.findOneOrFail(Event, parsedId);
    }

    async create(eventInput: Event): Promise<Event | undefined> {
        const event = this.em.create(Event, eventInput);
        await this.em.flush();
        return event;
    }

    async delete(id: string): Promise<Event | undefined> {
        const parsedId = Number.parseInt(id);
        const event = this.em.getReference(Event, parsedId);
        if (!event) {
            return undefined;
        }
        await this.em.removeAndFlush(event);
        return event;
    }

    async update(id: string, event: Event): Promise<Event | undefined>{
        const parsedId = Number.parseInt(id);
        const eventToUpdate = this.em.getReference(Event, parsedId);
        if (!event) {
            return undefined;
        }
        this.em.assign(eventToUpdate, event);
        await this.em.flush();
        return eventToUpdate;
      }

}