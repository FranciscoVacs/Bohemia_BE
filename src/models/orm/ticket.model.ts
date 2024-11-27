import { Ticket } from "../../entities/ticket.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class TicketModel extends BaseModel<Ticket> {
  constructor(em: EntityManager) {
    super(em, Ticket);
  }
  
}