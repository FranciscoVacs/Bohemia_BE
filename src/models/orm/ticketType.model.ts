import type { ITicketTypeModel } from "../../interfaces/ticketType.model.interface.js";
import {TicketType } from "../../entities/ticketType.entity.js";
import type { EntityManager } from "@mikro-orm/mysql";


export class TicketTypeModel implements ITicketTypeModel{
    constructor(private em: EntityManager){}

    async getAll(): Promise<TicketType[] | undefined> {
        return await this.em.find(TicketType, {});
    }

    async getById(id: string): Promise<TicketType | undefined> {
        const parsedId = Number.parseInt(id);
        return await this.em.findOneOrFail(TicketType, parsedId, { populate: ['event','event.location','event.location.city'] });
    }

    async create(ticketTypeInput: TicketType): Promise<TicketType | undefined> {
        const ticketType = this.em.create(TicketType, ticketTypeInput);
        await this.em.flush();
        return ticketType;
    }

    async delete(id: string): Promise<void> {
        const parsedId = Number.parseInt(id);
        const ticketType = await this.em.findOneOrFail(TicketType, parsedId);
        await this.em.removeAndFlush(ticketType);
    }

    async update(id: string, ticketTypeUpdates: Partial<TicketType>): Promise<void> {
        const parsedId = Number.parseInt(id);
        const ticketTypeToUpdate = await this.em.findOneOrFail(TicketType, parsedId);
        this.em.assign(ticketTypeToUpdate, ticketTypeUpdates);
        await this.em.flush();        
      }

}