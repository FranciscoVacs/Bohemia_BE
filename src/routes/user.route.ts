import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { User } from "../entities/user.entity.js";
import type { IUserModel } from "../interfaces/user.interface.js";
import { isAdmin, requireOwnerOrAdmin, verifyToken } from "../middlewares/auth.js";

export const userRouter = Router();

export const createUserRouter = ({
  userModel,
}: {
  userModel: IUserModel<User>; // 👈 Inject the user model, para los nuevos metodos
}) => {
  const userController = new UserController(userModel);   // 👈 Inject the user model, para los nuevos metodos

  userRouter.get("/", verifyToken, isAdmin, userController.getAll);
  userRouter.get("/:id", schemaValidator(UpdateUserSchema), userController.getById);
  userRouter.get("/tickets/:id", schemaValidator(UpdateUserSchema), userController.showTickets);
  userRouter.post("/", schemaValidator(CreateUserSchema), userController.create);
  userRouter.post("/register", schemaValidator(CreateUserSchema), userController.register);
  userRouter.post("/login", schemaValidator(UpdateUserSchema), userController.login);
  userRouter.patch("/:id",verifyToken, requireOwnerOrAdmin,schemaValidator(UpdateUserSchema), userController.update);
  userRouter.delete("/:id", verifyToken, requireOwnerOrAdmin, schemaValidator(UpdateUserSchema), userController.delete);

  return userRouter;
};
