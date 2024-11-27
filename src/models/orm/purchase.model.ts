import { Purchase } from "../../entities/purchase.entity.js";
import type { Ticket } from "../../entities/ticket.entity.js";
import { TicketType } from "../../entities/ticketType.entity.js";
import { User } from "../../entities/user.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";
import {createOrder} from "../../middlewares/mercadoPago.js";
export class PurchaseModel extends BaseModel<Purchase> {
  constructor(em: EntityManager) {
    super(em, Purchase);
  }

  async createProtocol(ticketType_id:string, ticket_quantity:number, user_id:string): Promise<Purchase | undefined> {
    const parsedTTId = Number.parseInt(ticketType_id);
    const parsedUID= Number.parseInt(user_id);
    const ticketType: TicketType = await this.em.findOneOrFail(TicketType,parsedTTId,{populate: ["event","event.location"]});
    if(ticketType.available_tickets <= ticket_quantity){
      throw new Error("Not enough tickets available for this purchase");
    }
    const actualUser: User = await this.em.findOneOrFail(User, parsedUID);
    const new_stock_tickets= ticketType.available_tickets - ticket_quantity;
    this.em.assign(ticketType, {"available_tickets": new_stock_tickets});
    const total_price = ticketType.price * ticket_quantity;

    createOrder(total_price, actualUser.email);

    return 
  }

}