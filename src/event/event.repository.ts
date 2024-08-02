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

export class EventRespository implements repository<Event> {
  public findAll(): Event[] | undefined {
    return events;
  }
  public findOne(item: { id: string }): Event | undefined {
    return events.find((event) => event.id == item.id);
  }
  public add(item: Event): Event | undefined {
    events.push(item);
    return item;
  }
  public update(item: Event): Event | undefined {
    const eventIdx = events.findIndex((event) => event.id == item.id);

    if (eventIdx !== -1) {
      events[eventIdx] = { ...events[eventIdx], ...item }
    }
    return events[eventIdx];
  }
  public delete(item: { id: string }): Event | undefined {
    const eventIdx = events.findIndex((event) => event.id === item.id)

    if (eventIdx !== -1) {
        const deletedEvents = events[eventIdx]
        events.splice(eventIdx, 1)
        return deletedEvents
    }
  }
}
