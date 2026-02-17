import { Location } from "../../entities/location.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class LocationModel extends BaseModel<Location> {
  constructor(em: EntityManager) {
    super(em, Location);
  }

  async getAll(): Promise<Location[] | undefined> {
    return await this.em.find(Location, {}, { populate: ["city"] });
  }

  async getById(id: string): Promise<Location | undefined> {
    const parsedId = Number.parseInt(id);
    const item =  await this.em.findOneOrFail(Location, parsedId, {populate: ["event"]});
    return item;
  }

}