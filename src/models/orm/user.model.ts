import { User } from "../../entities/user.entity.js";
import  type { IUserModel } from "../../interfaces/user.interface.js";
import { BaseModel } from "./baseModel.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";


export class UserModel extends BaseModel<User> implements IUserModel<User> {
  constructor(em: EntityManager) {
    super(em, User);
  }



  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.em.findOne(User, { email });
    return user !== null;
  }
}