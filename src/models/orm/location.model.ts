import { Location } from "../../entities/location.entity.js";
import { BaseModel } from "./baseModel.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class LocationModel extends BaseModel<Location> {
  constructor(em: EntityManager) {
    super(em, Location);
  }

}