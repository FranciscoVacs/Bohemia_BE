import type { User } from "../entities/user.entity.js";
import { BaseController } from "./baseController.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";

export class UserController extends BaseController<User> {
  constructor(protected model: IModel<User>) {
    super(model);
  }
}
