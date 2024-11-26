import { Ticket } from "../../entities/ticket.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class TicketModel extends BaseModel<Ticket> {
  constructor(em: EntityManager) {
    super(em, Ticket);
  }
  
  async create(data: RequiredEntityData<Ticket>): Promise<Ticket | undefined> {
    const entity = this.em.create(Ticket, data);
    const ticketType = await this.em.findOneOrFail("TicketType", {id: entity.ticket_type.id});
    //ticketType.decreaseAvailableQuantity();
    await this.em.flush();
    return entity;
  }
}