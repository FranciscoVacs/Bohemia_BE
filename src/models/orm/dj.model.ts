import { Dj } from "../../entities/dj.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class DjModel extends BaseModel<Dj> {
  constructor(em: EntityManager) {
    super(em, Dj);
  }

}