import {
  Cascade,
  Entity,
  OneToMany,
  Property,
  Collection,
} from "@mikro-orm/core";
import { Event } from "./event.entity.js";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";

@Entity()
export class EventAddress extends BaseEntity {
  @Property({ nullable: false, unique: true })
  province!: string;

  @Property({ nullable: false, unique: true })
  city!: string;

  @Property({ nullable: false, unique: true })
  street!: string;

  @Property({ nullable: false, unique: true })
  number!: number;

  @OneToMany(() => Event, (event) => event.eventAddress, {
    cascade: [Cascade.ALL],
  })
  events = new Collection<Event>(this);
}
