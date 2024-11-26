import type { User } from "../entities/user.entity.js";
import type { IUserModel } from "../interfaces/user.interface.js";
import { BaseController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import type { RequiredEntityData } from "@mikro-orm/core";
import { generateToken } from "../middlewares/auth.js";
import { boolean } from "zod";

export class UserController extends BaseController<User> {
  constructor(protected model: IUserModel<User>) {
    super(model);
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, user_name, user_surname, password, birth_date} = req.body;
      const userExists = await this.model.getByEmail(email);

      if (userExists !== null) {
        const message = "The user already exists";
        return res.status(400).send({ message});
      }

      const cryptedPass = await bcrypt.hash(password, 10);


      const newUser = await this.model.create({
        email,
        user_name,
        user_surname,
        password: cryptedPass,
        birth_date,
      } as RequiredEntityData<User>);

      const token = generateToken(newUser?.id, email, false);//generate token para usuario recien creado

      return res.status(201).header('token',token).send({ message: "User created", data: newUser });//mando el token junto con la data del usuario recien creado

    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, password} = req.body;
      const userExists = await this.model.getByEmail(email);

      if (!userExists) {
        const message = "The user does not exist";  
        return res.status(400).send({ message});
      }

      const validPass = await bcrypt.compare(password, userExists.password)

      if (!validPass) {
        const message = "Invalid password";
        return res.status(400).send({ message});
      }

      const token = generateToken(userExists.id,email,userExists.isAdmin);//genero token para usuario logueado

      const message = "User logged in";

      return res.status(200).header('token', token).send({ message});
      
    } catch (error) {
      next(error);
    }
  };

}

