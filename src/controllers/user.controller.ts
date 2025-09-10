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
    const { email, userName, userSurname, password, birthDate } = req.body;
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

    return res.status(201).header('token', token).send({ message: "User created", data: newUser });
  });

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const userExists = await this.model.getByEmail(email);

    const validUser = assertResourceExists(userExists, "User");

    const validPass = await bcrypt.compare(password, validUser.password);

    if (!validPass) {
      throwError.badRequest("Invalid password");
    }

    const token = generateToken(validUser.id, email, validUser.isAdmin);

    return res.status(200).header('token', token).send({ message: "User logged in" });
  });


  getCurrentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const user = await this.model.getById(userId!.toString());
    return res.status(200).send({ data: user });
  });

  getCurrentUserPurchases = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const userPurchases = await this.model.getUserPurchases(userId!.toString());
    return res.status(200).send({ data: userPurchases });
  });

  updateCurrentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const updatedUser = await this.model.update(userId!.toString(), req.body);
    return res.status(200).send({ message: "User updated", data: updatedUser });
  });

  deleteCurrentUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    await this.model.delete(userId!.toString());
    return res.status(200).send({ message: "Account deleted successfully" });
  });

  getCurrentUserPurchaseTickets = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const purchaseId = req.params.id;
    
    // Obtener la compra específica y verificar que pertenece al usuario
    const userPurchases = await this.model.getUserPurchases(userId!.toString());
    const purchase = userPurchases?.find(p => p.id?.toString() === purchaseId);
    
    if (!purchase) {
      throwError.notFound("Purchase not found or doesn't belong to you");
    }
    
    // Devolver solo los tickets de esta compra
    return res.status(200).send({ data: (purchase as any).ticket || [] });
  });

}

