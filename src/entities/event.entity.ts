import { Entity, Property, ManyToOne, OneToMany, Cascade, Collection } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Location } from "./location.entity.js";
import { TicketType } from "./ticketType.entity.js";
import { Dj } from "./dj.entity.js";

@Entity()
export class Event extends BaseEntity {
  @Property({ length: 100, fieldName: 'event_name' })
  eventName!: string;

  @Property({ fieldName: 'begin_datetime' })
  beginDatetime!: Date;

  @Property({ fieldName: 'finish_datetime' })
  finishDatetime!: Date;

  @Property({ length: 500, fieldName: 'event_description' })
  eventDescription!: string;

  @Property({ fieldName: 'min_age' })
  minAge!: number;

  @Property({ fieldName: 'cover_photo' })
  coverPhoto!: string;

  @Property({ default: 0, fieldName: 'tickets_on_sale' })
  ticketsOnSale!: number;

  @Property({ default: 'ARCHIVED', fieldName: 'gallery_status' })
  galleryStatus: 'PUBLISHED' | 'ARCHIVED' = 'ARCHIVED';

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>;

  @ManyToOne(() => Dj, { nullable: false })
  dj!: Rel<Dj>;

  @OneToMany(() => TicketType, ticketType => ticketType.event, { cascade: [Cascade.ALL], orphanRemoval: true })
  ticketType = new Collection<TicketType>(this);
}
