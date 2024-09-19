import type { ILocationModel } from "../../interfaces/location.model.interface.js";
import {Location } from "../../entities/location.entity.js";
import type { EntityManager } from "@mikro-orm/mysql";


export class LocationModel implements ILocationModel{
    constructor(private em: EntityManager){}

    async getAll(): Promise<Location[] | undefined> {
        return await this.em.find(Location, {});
    }

    async getById(id: string): Promise<Location | undefined> {
        const parsedId = Number.parseInt(id);
        return await this.em.findOneOrFail(Location, parsedId, { populate: ['event', 'city'] });
    }

    async create(locationInput: Location): Promise<Location | undefined> {
        const location = this.em.create(Location, locationInput);
        await this.em.flush();
        return location;
    }

    async delete(id: string): Promise<void> {
        const parsedId = Number.parseInt(id);
        const location = await this.em.findOneOrFail(Location, parsedId);
        await this.em.removeAndFlush(location);
    }

    async update(id: string, locationUpdates: Partial<Location>): Promise<void> {
        const parsedId = Number.parseInt(id);
        const locationToUpdate = await this.em.findOneOrFail(Location, parsedId);
        this.em.assign(locationToUpdate, locationUpdates);
        await this.em.flush();        
      }

}