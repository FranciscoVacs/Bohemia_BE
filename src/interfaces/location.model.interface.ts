import type { Location } from "../entities/location.entity";

export interface ILocationModel {
  getAll(): Promise<Location[] | undefined>;
  getById(id: string): Promise<Location | undefined>;
  create(location: Location): Promise<Location | undefined>;
  update(id: string, location: Partial<Location>): Promise<void>;
  delete(id: string): Promise<void>;
}