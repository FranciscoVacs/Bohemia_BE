import { repository } from "../shared/repository.js";
import { Event } from "./event.entity.js";
import { db } from "../shared/db/conn.js";
import { ObjectId } from "mongodb";

const eventsArray = [
  new Event(
    "Wos en el luna park",
    "Es Wos!!! en el luna park!!!!",
    5000,
    "santa cruz 1540",
    "2023-05-19",
    18,
  ),
];

const events = db.collection<Event>("events");

export class EventRepository implements repository<Event> {
  public async findAll(): Promise<Event[] | undefined> {
    return await events.find().toArray();
  }

  public async findOne(item: { id: string }): Promise<Event | undefined> {
    const _id = new ObjectId(item.id);
    return (await events.findOne({ _id })) || undefined;
  }

  public async add(item: Event): Promise<Event | undefined> {
    item._id = (await events.insertOne(item)).insertedId;
    return item;
  }

  public async update(id:string, item: Event): Promise<Event | undefined> {
    const _id = new ObjectId(id);
    return (
      (await events.findOneAndUpdate(
        { _id },
        { $set: item },
        { returnDocument: "after" }
      )) || undefined
    );
  }

  public async delete(item: { id: string }): Promise<Event | undefined> {
    const _id = new ObjectId(item.id)
    return (await events.findOneAndDelete({_id}) || undefined)
  }
}
