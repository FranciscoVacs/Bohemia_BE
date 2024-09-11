import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Location } from "./location.entity.js";

@Entity()
export class Event extends BaseEntity {
  @Property()
  begin_datetime!: string;

  @Property()
  finish_datetime!: string;

  @Property()
  event_description!: string;

  @Property()
  min_age!: number;

  @ManyToOne(() => Location, { nullable: false })
  location!: Rel<Location>;
}
