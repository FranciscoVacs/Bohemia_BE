import mysql from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Eventos } from "../../entities/eventos.entity.js";
import type { IEventoModel } from "../../interfaces/eventos.model.interface.js";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "root",
  database: "bohemiadb",
};

const connection = await mysql.createConnection(config);

export class EventoModel implements IEventoModel {
  async getAll(): Promise<Eventos[] | undefined> {
    const [eventos] = await connection.query(
      "SELECT begin_datetime, finish_datetime, event_description, min_age, location_id, id FROM eventos",
    );
    return eventos as Eventos[];
  }

  async getById(id: string): Promise<Eventos | undefined> {
    const parsedId = Number.parseInt(id);
    const [eventos] = await connection.query<RowDataPacket[]>(
      "SELECT begin_datetime, finish_datetime, event_description, min_age, location_id, id FROM eventos WHERE id = ?",
      [parsedId],
    );
    if (eventos.length === 0) {
      return undefined;
    }
    const evento = eventos[0] as Eventos;

    return evento;
  }

  async create(eventoInput: Eventos): Promise<Eventos | undefined> {
    try {
      const { id, ...eventoRow } = eventoInput;
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO eventos set ?",
        [eventoRow],
      );

      eventoInput.id = result.insertId;
      return eventoInput;
    } catch (error) {
      console.error("Error inserting evento:", error);
      throw new Error("Database operation failed");
    }
  }

  async delete(id: string): Promise<Eventos | undefined> {
    try {
      const eventoToBeDeleted = await this.getById(id);
      const parsedId = Number.parseInt(id);
      await connection.query("delete FROM eventos WHERE id = ?", [parsedId]);

      return eventoToBeDeleted as Eventos;
    } catch (error) {
      console.error("Error deleting evento:", error);
      throw new Error("Database operation failed");
    }
  }

  async update(id: string, eventoInput: Eventos): Promise<Eventos | undefined> {
    try {
      const parsedId = Number.parseInt(id);
      const { ...eventoRow } = eventoInput;
      if (Object.keys(eventoRow).length === 0) {
        throw new Error("No data to update");
      }
      await connection.query("update eventos set ? where id = ?", [
        eventoRow,
        parsedId,
      ]);
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating evento:", error);
      throw new Error("Database operation failed");
    }
  }
}
