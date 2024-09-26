import type { RequiredEntityData } from "@mikro-orm/core";

export interface IModel<T> {
    getAll(): Promise<T[] | undefined>;
    getById(id: string): Promise<T | undefined>;
    create(data: RequiredEntityData<T>): Promise<T | undefined>;
    update(id: string, updates: Partial<T>): Promise<void>;
    delete(id: string): Promise<void>;  
  }