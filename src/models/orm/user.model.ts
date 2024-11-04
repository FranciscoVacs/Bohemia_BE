import { User } from "../../entities/user.entity.js";
import { BaseModel } from "./baseModel.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class UserModel extends BaseModel<User> {
  constructor(em: EntityManager) {
    super(em, User);
  }
}