import { Ticket } from "../../entities/ticket.entity.js";
import { User } from "../../entities/user.entity.js";
import  type { IUserModel } from "../../interfaces/user.interface.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";


export class UserModel extends BaseModel<User> implements IUserModel<User> {
  constructor(em: EntityManager) {
    super(em, User);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.em.findOne(User, { email });
    return user;
  }

  async getUserPurchases(id: string) {
    const parsedId = Number.parseInt(id);
    const user = await this.em.findOneOrFail(User, parsedId, {
      populate: [
        "purchase",
        "purchase.ticketType",
        "purchase.ticketType.event",
        "purchase.ticket"
      ]
    });
    return user.purchase.getItems();
  }
}