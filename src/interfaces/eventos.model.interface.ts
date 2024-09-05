import type { Eventos } from "../entities/eventos.entity";

export interface IEventoModel {
  getAll(): Promise<Eventos[] | undefined>;
  getById(id: string): Promise<Eventos | undefined>;
  create(evento: Eventos): Promise<Eventos | undefined>;
  update(id: string, evento: Eventos): Promise<Eventos | undefined>;
  delete(id: string): Promise<Eventos | undefined>;
}