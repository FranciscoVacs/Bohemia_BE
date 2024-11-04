import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { schemaValidator } from "../middlewares/schemaValidator.js";
import { CreateUserSchema, UpdateUserSchema } from "../schemas/user.schema.js";
import type{ IModel } from "../interfaces/model.interface.js";
import type { User } from "../entities/user.entity.js";

export const userRouter = Router();

export const createUserRouter = ({
  userModel,
}: {
  userModel: IModel<User>;
}) => {
  const userController = new UserController(userModel);

  userRouter.get("/", userController.getAll);
  userRouter.get("/:id", schemaValidator(UpdateUserSchema), userController.getById);
  userRouter.post("/", schemaValidator(CreateUserSchema), userController.create);
  userRouter.patch("/:id", schemaValidator(UpdateUserSchema), userController.update);
  userRouter.delete("/:id", schemaValidator(UpdateUserSchema), userController.delete);

  return userRouter;
};
