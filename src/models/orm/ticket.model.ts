import type { ITicketModel } from "../../interfaces/ticket.model.interface.js";
import {Ticket } from "../../entities/ticket.entity.js";
import type { EntityManager } from "@mikro-orm/mysql";


export class TicketModel implements ITicketModel{
    constructor(private em: EntityManager){}

    async getAll(): Promise<Ticket[] | undefined> {
        return await this.em.find(Ticket, {});
    }

    async getById(id: string): Promise<Ticket | undefined> {
        const parsedId = Number.parseInt(id);
        return await this.em.findOneOrFail(Ticket, parsedId,{ populate: ['ticketType', 'ticketType.event', 'ticketType.event.location','ticketType.event.location.city'] });
    }

    async create(ticketInput: Ticket): Promise<Ticket | undefined> {
        const ticket = this.em.create(Ticket, ticketInput);
        await this.em.flush();
        return ticket;
    }

    async delete(id: string): Promise<void> {
        const parsedId = Number.parseInt(id);
        const ticket = await this.em.findOneOrFail(Ticket, parsedId);
        await this.em.removeAndFlush(ticket);
    }

    async update(id: string, ticketUpdates: Partial<Ticket>): Promise<void> {
        const parsedId = Number.parseInt(id);
        const ticketToUpdate = await this.em.findOneOrFail(Ticket, parsedId);
        this.em.assign(ticketToUpdate, ticketUpdates);
        await this.em.flush();        
      }

}