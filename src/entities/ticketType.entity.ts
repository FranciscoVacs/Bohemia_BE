import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";

@Entity()
export class TicketType extends BaseEntity {

    @Property()
    ticketType_name!: string;

    @Property()
    startDateTime!: Date;

    @Property()
    endDateTime!: Date;

    @Property()
    price!: number;

    @ManyToOne(() => Event, { nullable: false })
    event!: Rel<Event>;

}