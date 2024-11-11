import type { Location } from "../entities/location.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class LocationController extends BaseController<Location> {
  constructor(protected model: IModel<Location>) {
    super(model);
  }

}
