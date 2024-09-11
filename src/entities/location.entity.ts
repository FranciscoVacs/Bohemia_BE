import { Entity, OneToMany, Property,Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";

@Entity()
export class Location extends BaseEntity {
    @Property()
    name!: string;

    @Property()
    address!: string;

    @Property()
    city!: string;

    @Property()
    state!: string;

    @Property()
    zip!: number;

    @OneToMany(()=>Event, event=>event.location, {cascade:[Cascade.ALL]})
    events = new Collection<Event>(this);
}