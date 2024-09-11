import mysql from "mysql2/promise";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { Event } from "../../entities/event.entity.js";
import type { IEventModel } from "../../interfaces/event.model.interface.js";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "root",
  database: "bohemiadb",
};

const connection = await mysql.createConnection(config);

export class EventModel implements IEventModel {
  async getAll(): Promise<Event[] | undefined> {
    const [event] = await connection.query(
      "SELECT begin_datetime, finish_datetime, event_description, min_age, location_id, id FROM event",
    );
    return event as Event[];
  }

  async getById(id: string): Promise<Event | undefined> {
    const parsedId = Number.parseInt(id);
    const [evento] = await connection.query<RowDataPacket[]>(
      "SELECT begin_datetime, finish_datetime, event_description, min_age, location_id, id FROM event WHERE id = ?",
      [parsedId],
    );
    if (evento.length === 0) {
      return undefined;
    }
    const event = evento[0] as Event;

    return event;
  }

  async create(eventInput: Event): Promise<Event | undefined> {
    try {
      const { id, ...eventRow } = eventInput;
      const [result] = await connection.query<ResultSetHeader>(
        "INSERT INTO event set ?",
        [eventRow],
      );

      eventInput.id = result.insertId;
      return eventInput;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw new Error("Database operation failed");
    }
  }

  async delete(id: string): Promise<Event | undefined> {
    try {
      const eventToBeDeleted = await this.getById(id);
      const parsedId = Number.parseInt(id);
      await connection.query("delete FROM event WHERE id = ?", [parsedId]);

      return eventToBeDeleted as Event;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw new Error("Database operation failed");
    }
  }

  async update(id: string, eventInput: Event): Promise<Event | undefined> {
    try {
      const parsedId = Number.parseInt(id);
      const { ...eventRow } = eventInput;
      if (Object.keys(eventRow).length === 0) {
        throw new Error("No data to update");
      }
      await connection.query("update event set ? where id = ?", [
        eventRow,
        parsedId,
      ]);
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating event:", error);
      throw new Error("Database operation failed");
    }
  }
}
