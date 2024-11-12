import type { Ticket } from "../entities/ticket.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuid } from 'uuid';
import type { RequiredEntityData } from "@mikro-orm/core";


export class TicketController extends BaseController<Ticket> {
  constructor(protected model: IModel<Ticket>) {
    super(model);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newCode = uuid();
      const itemInput = req.body;
      const newTicket = await this.model.create({
        ...itemInput,
        qr_code: newCode,
      } as RequiredEntityData<Ticket>);
      return res.status(201).send({ message: "Item created", data: newTicket });
    } catch (error) {
      next(error);
    }
  };

}
