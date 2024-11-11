import type { Purchase } from "../entities/purchase.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class PurchaseController extends BaseController<Purchase> {
  constructor(protected model: IModel<Purchase>) {
    super(model);
  }

}
