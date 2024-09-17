import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Location } from "./location.entity.js";

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

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>;
}
