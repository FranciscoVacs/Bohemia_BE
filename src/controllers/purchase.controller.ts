import type { Purchase } from "../entities/purchase.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import { TicketTypeController } from "./ticketType.controller.js";
import type { Request, Response, NextFunction } from "express";
import type { IPurchaseModel } from "../interfaces/purchase.interface.js";


export class PurchaseController extends BaseController<Purchase> {
  constructor(protected model: IPurchaseModel<Purchase>) {
    super(model);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {ticketType_id, ticket_quantity, user_id} = req.body;
      const item = await this.model.createProtocol(ticketType_id, ticket_quantity, user_id);
      const purchaseData  = {
        id: item?.id,
        ticket_numbers: item?.ticket_numbers,
        payment_status: item?.payment_status,
        discount_applied: item?.discount_applied,
        total_price: item?.total_price,
        user_id: item?.user.id,
        ticket_type_id: item?.ticket_type.id
      };

      return res.status(201).send({ message: "Item created", data: purchaseData });
    } catch (error) {
      next(error);
    }
  };


}
