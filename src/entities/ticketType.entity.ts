import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
import { Ticket } from "./ticket.entity.js";

@Entity()
export class TicketType extends BaseEntity {

    @Property()
    ticketType_name!: string;

    @Property()
    begin_datetime!: Date;

    @Property()
    finish_datetime!: Date;

    @Property()
    price!: number;

    @Property()
    max_quantity!: number;
    
    @ManyToOne(() => Event, { nullable: false })
    event!: Rel<Event>;

    @OneToMany(() => Ticket, ticket => ticket.ticketType)
    ticket = new Collection<Ticket>(this);

  }
