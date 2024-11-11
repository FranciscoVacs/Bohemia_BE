import { Purchase } from "../../entities/purchase.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class PurchaseModel extends BaseModel<Purchase> {
  constructor(em: EntityManager) {
    super(em, Purchase);
  }

}