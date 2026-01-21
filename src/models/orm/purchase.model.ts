import type { EntityManager } from "@mikro-orm/mysql";
import { Purchase } from "../../entities/purchase.entity.js";
import { TicketType } from "../../entities/ticketType.entity.js";
import { User } from "../../entities/user.entity.js";
import { Ticket } from "../../entities/ticket.entity.js";
import { BaseModel } from "./base.Model.js";
import { v4 as uuid } from "uuid";
import { throwError, assertResourceExists, assertBusinessRule } from "../../shared/errors/ErrorUtils.js";

export class PurchaseModel extends BaseModel<Purchase> {
  constructor(em: EntityManager) {
    super(em, Purchase);
  }

  async createProtocol(
    ticketTypeId: string,
    ticketQuantity: number,
    userId: string,
  ): Promise<Purchase | undefined> {
    const parsedTTId = Number.parseInt(ticketTypeId);
    const parsedUID = Number.parseInt(userId);

    const ticketType: TicketType = await this.em.findOneOrFail(
      TicketType,
      parsedTTId,
      { populate: ["event"] },
    );

    // Validar que la venta está activa
    assertBusinessRule(
      ticketType.isSaleActive(),
      "Sales are not currently active for this ticket type"
    );

    // Validar que hay suficientes tickets disponibles
    assertBusinessRule(
      ticketType.availableTickets >= ticketQuantity,
      "Not enough tickets available for this purchase"
    );

    const actualUser: User = await this.em.findOneOrFail(User, parsedUID);
    const newStockTickets = ticketType.availableTickets - ticketQuantity;
    console.log("newStockTickets", newStockTickets);
    console.log("availableTickets", ticketType.availableTickets);

    this.em.assign(ticketType, { availableTickets: newStockTickets });

    // Calcular pricing con cargo de servicio
    const subtotal = ticketType.price * ticketQuantity;
    const serviceFeePercentage = Number.parseFloat(process.env.SERVICE_FEE_PERCENTAGE || '0.1');
    const serviceFee = subtotal * serviceFeePercentage;
    const totalPrice = subtotal + serviceFee;

    const purchaseActual = this.em.create(Purchase, {
      ticketNumbers: ticketQuantity,
      paymentStatus: "Approved",
      discountApplied: 0,
      serviceFee: serviceFee,
      user: actualUser,
      ticketType: ticketType,
      totalPrice: totalPrice,
    } as Purchase);

    //crear los tickets
    for (let i = 1; i <= ticketQuantity; i++) {
      this.em.create(Ticket, {
        qrCode: uuid(),
        numberInPurchase: i,
        numberInTicketType:
          ticketType.maxQuantity - ticketType.availableTickets,
        purchase: purchaseActual,
      } as Ticket);
    }
    await this.em.flush();

    return purchaseActual;
  }

  async getById(id: string): Promise<Purchase | undefined> {
    const parsedId = Number.parseInt(id);
    return await this.em.findOneOrFail(Purchase, parsedId, {
      populate: [
        "ticket.qrCode",
        "ticketType",
        "ticketType.event",
        "ticketType.event.location",
      ],
    });
  }

  async getTickets(id: string): Promise<Purchase | undefined> {
    const parsedId = Number.parseInt(id);
    return await this.em.findOneOrFail(Purchase, parsedId, {
      populate: ["ticket"],
    });
  }
}
