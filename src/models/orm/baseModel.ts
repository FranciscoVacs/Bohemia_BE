
import type { IModel } from "../../interfaces/model.interface.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class BaseModel<T> implements IModel<T> {
  constructor(protected readonly em: EntityManager, private readonly entityClass: { new (): T }) {}

  async getAll(): Promise<T[] | undefined> {
    return await this.em.find(this.entityClass, {});
  }

  async getById(id: string): Promise<T | undefined> {
    const parsedId = Number.parseInt(id);
    return await this.em.findOne(this.entityClass, parsedId);
  }

  async create(data: RequiredEntityData<T>): Promise<T | undefined> {
    const entity = this.em.create(this.entityClass, data);
    await this.em.flush();
    return entity;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const parsedId = Number.parseInt(id);
    const entityToUpdate = await this.em.findOneOrFail(this.entityClass, parsedId);
    this.em.assign(entityToUpdate, data);
    await this.em.flush();
  }

  async delete(id: string): Promise<void> {
    const parsedId = Number.parseInt(id);
    const entity = await this.em.findOneOrFail(this.entityClass, parsedId);
    await this.em.removeAndFlush(entity);
  }
}