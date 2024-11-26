import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Location } from "./location.entity.js";
import { TicketType } from "./ticketType.entity.js";
import { Dj } from "./dj.entity.js";

@Entity()
export class Event extends BaseEntity {
  @Property({ length: 100 })
  event_name!: string;

  @Property()
  begin_datetime!: Date;

  @Property()
  finish_datetime!: Date;

  @Property({ length: 500 })
  event_description!: string;

  @Property()
  min_age!: number;

  @Property()
  cover_photo!: string;

  @Property({default: 0})
  tickets_on_sale!: number;

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>;

  @ManyToOne(() => Dj, { nullable: false })
  dj!: Rel<Dj>;

  @OneToMany(()=>TicketType, ticketType=>ticketType.event, {cascade:[Cascade.ALL], orphanRemoval: true})
  ticketType = new Collection<TicketType>(this);
}
