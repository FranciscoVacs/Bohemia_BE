import { ObjectId } from 'mongodb';
import crypto from 'node:crypto';

export class Event {
  constructor(
    public name: string,
    public description: string,
    public total_capacity: number,
    public direction: string,
    public date_time: string,
    public min_age: number,
    public _id?: ObjectId
  ) {}
}
