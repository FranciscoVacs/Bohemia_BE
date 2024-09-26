import { City } from "../../entities/city.entity.js";
import { BaseModel } from "./baseModel.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class CityModel extends BaseModel<City> {
  constructor(em: EntityManager) {
    super(em, City);
  }

}