import type { User } from "../entities/user.entity.js";
import type { IUserModel } from "../interfaces/user.interface.js";
import { BaseController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import type { RequiredEntityData } from "@mikro-orm/core";
import { generateToken } from "../middlewares/auth.js";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export class UserController extends BaseController<User> {
  constructor(protected model: IUserModel<User>) {
    super(model);
  }

  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {email, userName, userSurname, password, birthDate} = req.body;
    const userExists = await this.model.getByEmail(email);

    if (userExists !== null) {
      throwError.conflict("The user already exists");
    }

    const cryptedPass = await bcrypt.hash(password, 10);

    const newUser = await this.model.create({
      email,
      userName,
      userSurname,
      password: cryptedPass,
      birthDate,
    } as RequiredEntityData<User>);

    const token = generateToken(newUser?.id, email, false);

    return res.status(201).header('token',token).send({ message: "User created", data: newUser });
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = req.body;
    const userExists = await this.model.getByEmail(email);

    const validUser = assertResourceExists(userExists, "User");

    const validPass = await bcrypt.compare(password, validUser.password);

    if (!validPass) {
      throwError.badRequest("Invalid password");
    }

    const token = generateToken(validUser.id, email, validUser.isAdmin);

    return res.status(200).header('token', token).send({ message: "User logged in" });
  });

  showTickets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userTickets = await this.model.showTickets(id);
    return res.status(200).send({ data: userTickets });
  });

}

