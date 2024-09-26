import type { Ticket } from "../entities/ticket.entity.js";
import { BaseController } from "./baseController.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class TicketController extends BaseController<Ticket> {
  constructor(protected model: IModel<Ticket>) {
    super(model);
  }

}
