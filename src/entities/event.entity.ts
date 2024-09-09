export class Event {
  constructor(
    public begin_datetime: string,
    public finish_datetime: string,
    public event_description: string,
    public min_age: number,
    public location_id: number,
    public id?: number,
  ) {}
}
