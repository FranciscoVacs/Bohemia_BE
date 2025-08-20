import type { Ticket } from "../entities/ticket.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { v4 as uuid } from 'uuid';
import type { RequiredEntityData } from "@mikro-orm/core";
import { asyncHandler } from "../middlewares/asyncHandler.js";


export class TicketController extends BaseController<Ticket> {
  constructor(protected model: IModel<Ticket>) {
    super(model);
  }

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newCode = uuid();
    const itemInput = req.body;
    const newTicket = await this.model.create({
      ...itemInput,
      qrCode: newCode,
    } as RequiredEntityData<Ticket>);
    return res.status(201).send({ message: "Item created", data: newTicket });
  });

}
