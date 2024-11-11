import type { City } from "../entities/city.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class CityController extends BaseController<City> {
  constructor(protected model: IModel<City>) {
    super(model);
  }
}
