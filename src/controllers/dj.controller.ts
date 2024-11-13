import type { Dj } from "../entities/dj.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class DjController extends BaseController<Dj> {
  constructor(protected model: IModel<Dj>) {
    super(model);
  }
}
