import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { User } from "../entities/user.entity.js";
import type { IUserModel } from "../interfaces/user.interface.js";

export const userRouter = Router();

export const createUserRouter = ({
  userModel,
}: {
  userModel: IUserModel<User>; // 👈 Inject the user model, para los nuevos metodos
}) => {
  const userController = new UserController(userModel);   // 👈 Inject the user model, para los nuevos metodos

  userRouter.get("/", userController.getAll);
  userRouter.get("/:id", schemaValidator(UpdateUserSchema), userController.getById);
  userRouter.post("/", schemaValidator(CreateUserSchema), userController.create);
  userRouter.post("/register", schemaValidator(CreateUserSchema), userController.register);
  userRouter.patch("/:id", schemaValidator(UpdateUserSchema), userController.update);
  userRouter.delete("/:id", schemaValidator(UpdateUserSchema), userController.delete);

  return userRouter;
};
