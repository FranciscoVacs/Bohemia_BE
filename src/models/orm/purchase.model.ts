import { Purchase } from "../../entities/purchase.entity.js";
import  { Ticket } from "../../entities/ticket.entity.js";
import { TicketType } from "../../entities/ticketType.entity.js";
import { User } from "../../entities/user.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";
import {createOrder} from "../../middlewares/mercadoPago.js";
import { v4 as uuid } from 'uuid';

export class PurchaseModel extends BaseModel<Purchase> {
  constructor(em: EntityManager) {
    super(em, Purchase);
  }

  async createProtocol(ticketType_id:string, ticket_quantity:number, user_id:string): Promise<Purchase | undefined> {
    const parsedTTId = Number.parseInt(ticketType_id);
    const parsedUID= Number.parseInt(user_id);
    const ticketType: TicketType = await this.em.findOneOrFail(TicketType,parsedTTId,{populate: ["event"]});
    if(ticketType.available_tickets < ticket_quantity){
      throw new Error("Not enough tickets available for this purchase");
    }
    const actualUser: User = await this.em.findOneOrFail(User, parsedUID);
    const new_stock_tickets = ticketType.available_tickets - ticket_quantity;
    console.log("new_stock_tickets", new_stock_tickets);
    console.log("available_tickets", ticketType.available_tickets);

    this.em.assign(ticketType, {"available_tickets": new_stock_tickets});
    const total_price = ticketType.price * ticket_quantity;
    const purchseActual = this.em.create(Purchase, {
      ticket_numbers: ticket_quantity,
      payment_status: "Approved",
      discount_applied: 0,
      user: actualUser,
      ticket_type: ticketType,
      total_price: total_price,
    }as Purchase);


    //crear los tickets
    for (let i = 0; i < ticket_quantity; i++) {
      this.em.create(Ticket,
        {
          qr_code: uuid(),
          number_in_purchase: i+1,
          number_in_ticket_type: ticketType.max_quantity-ticketType.available_tickets,
          ticket_type: ticketType,
          purchase: purchseActual,
        }as Ticket);
      
    }
    await this.em.flush();

    return purchseActual;
  }

}