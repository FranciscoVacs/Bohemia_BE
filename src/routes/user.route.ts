import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { User } from "../entities/user.entity.js";
import type { IUserModel } from "../interfaces/user.interface.js";
import { isAdmin, verifyToken } from "../middlewares/auth.js";

export const userRouter = Router();

export const createUserRouter = ({
  userModel,
}: {
  userModel: IUserModel<User>; // 👈 Inject the user model, para los nuevos metodos
}) => {
  const userController = new UserController(userModel);

  // Rutas públicas de autenticación (sin autenticación)
  userRouter.post("/register", schemaValidator(CreateUserSchema), userController.register);
  userRouter.post("/login", schemaValidator(UpdateUserSchema), userController.login);

  // Rutas del usuario actual (requieren solo autenticación)
  userRouter.get("/me", verifyToken, userController.getCurrentUser);
  userRouter.get("/me/purchases", verifyToken, userController.getCurrentUserPurchases);
  userRouter.get("/me/purchases/:id/tickets", verifyToken, userController.getCurrentUserPurchaseTickets);
  userRouter.patch("/me", verifyToken, schemaValidator(UpdateUserSchema), userController.updateCurrentUser);
  userRouter.delete("/me", verifyToken, userController.deleteCurrentUser);

  // Rutas administrativas (solo admin puede gestionar otros usuarios)
  userRouter.get("/", verifyToken, isAdmin, userController.getAll);
  userRouter.post("/", verifyToken, isAdmin, schemaValidator(CreateUserSchema), userController.create);
  userRouter.get("/:id", verifyToken, isAdmin, schemaValidator(UpdateUserSchema), userController.getById);
  userRouter.patch("/:id", verifyToken, isAdmin, schemaValidator(UpdateUserSchema), userController.update);
  userRouter.delete("/:id", verifyToken, isAdmin, schemaValidator(UpdateUserSchema), userController.delete);

  return userRouter;
};
