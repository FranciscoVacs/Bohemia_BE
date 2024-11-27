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
      return res.status(201).send({ message: "Item created", data: item });
    } catch (error) {
      next(error);
    }
  };


}
