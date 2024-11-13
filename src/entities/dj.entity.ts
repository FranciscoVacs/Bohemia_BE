import { Entity, OneToMany, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
@Entity()
export class Dj extends BaseEntity {

    @Property({length:100})
    dj_name!: string;

    @Property({length:100})
    dj_surname!: string;

    @Property()
    dj_apodo!: string;

    @OneToMany(()=>Event, event=>event.dj , {cascade:[Cascade.ALL]})
    event = new Collection<Event>(this);
    
}