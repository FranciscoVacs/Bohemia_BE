import type { Event } from "../entities/event.entity";

export interface IEventModel {
  getAll(): Promise<Event[] | undefined>;
  getById(id: string): Promise<Event | undefined>;
  create(event: Event): Promise<Event | undefined>;
  update(id: string, event: Partial<Event>): Promise<void>;
  delete(id: string): Promise<void>;
}