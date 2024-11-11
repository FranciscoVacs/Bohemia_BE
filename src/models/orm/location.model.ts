import { Location } from "../../entities/location.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class LocationModel extends BaseModel<Location> {
  constructor(em: EntityManager) {
    super(em, Location);
  }

}