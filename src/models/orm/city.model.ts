import type { ICityModel } from "../../interfaces/city.model.interface.js";
import { City } from "../../entities/city.entity.js";
import type { EntityManager } from "@mikro-orm/mysql";


export class CityModel implements ICityModel{
    constructor(private em: EntityManager){}

    async getAll(): Promise<City[] | undefined> {
        return await this.em.find(City, {});
    }

    async getById(id: string): Promise<City | undefined> {
        const parsedId = Number.parseInt(id);
        return await this.em.findOneOrFail(City, parsedId, { populate: ['location'] });
    }

    async create(cityInput: City): Promise<City | undefined> {
        const city = this.em.create(City, cityInput);
        await this.em.flush();
        return city;
    }

    async delete(id: string): Promise<void> {
        const parsedId = Number.parseInt(id);
        const city = await this.em.findOneOrFail(City, parsedId);
        await this.em.removeAndFlush(city);
    }

    async update(id: string, cityUpdates: Partial<City>): Promise<void> {
        const parsedId = Number.parseInt(id);
        const cityToUpdate = await this.em.findOneOrFail(City, parsedId);
        this.em.assign(cityToUpdate, cityUpdates);
        await this.em.flush();        
      }

}