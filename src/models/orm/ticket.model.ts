import { Ticket } from "../../entities/ticket.entity.js";
import { BaseModel } from "./baseModel.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class TicketModel extends BaseModel<Ticket> {
  constructor(em: EntityManager) {
    super(em, Ticket);
  }

}