import { Entity, OneToMany, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";

@Entity()
export class Location extends BaseEntity {

    @Property({length:100})
    location_name!: string;

    @Property({length:100})
    @Unique()
    address!: string;

    @Property({length:100})
    city!: string;

    @Property({length:100})
    state!: string;

    @Property()
    zip!: number;

    @OneToMany(()=>Event, event=>event.location, {cascade:[Cascade.ALL]})
    events = new Collection<Event>(this);
}