import { repository } from "../shared/repository.js";
import { Event } from "./event.entity.js";

const events = [
  new Event(
    "Wos en el luna park",
    "Es Wos!!! en el luna park!!!!",
    5000,
    "santa cruz 1540",
    "2023-05-19",
    18,
    "id-de-prueba-test-lorem_ipsum"
  ),
];

export class EventRepository implements repository<Event> {
  public async findAll(): Promise<Event[] | undefined>{
    return await events;
  }

  public async findOne(item: { id: string }): Promise<Event | undefined> {
    return await events.find((event) => event.id == item.id);
  }

  public async add(item: Event): Promise<Event | undefined >{
    events.push(item);
    return await item;
  }

  public async update(item: Event): Promise<Event | undefined >{
    const eventIdx = events.findIndex((event) => event.id == item.id);
    if (eventIdx !== -1) {
      events[eventIdx] = { ...events[eventIdx], ...item }
    }
    return await events[eventIdx];
  }

  public async delete(item: { id: string }): Promise<Event | undefined> {
    const eventIdx = events.findIndex((event) => event.id === item.id)
    if (eventIdx !== -1) {
        const deletedEvents = events[eventIdx]
        events.splice(eventIdx, 1)
        return await deletedEvents
    }
  }
}
