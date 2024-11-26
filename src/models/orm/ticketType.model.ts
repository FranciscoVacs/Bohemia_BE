
import { TicketType } from "../../entities/ticketType.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class TicketTypeModel extends BaseModel<TicketType> {
  constructor(em: EntityManager) {
    super(em, TicketType);
  }

}