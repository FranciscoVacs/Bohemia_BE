import type { TicketType } from "../entities/ticketType.entity.js";
import { BaseController } from "./baseController.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class TicketTypeController extends BaseController<TicketType> {
  constructor(protected model: IModel<TicketType>) {
    super(model);
  }
}
