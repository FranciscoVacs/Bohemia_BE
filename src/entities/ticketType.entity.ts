import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique, BeforeCreate } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
import { Ticket } from "./ticket.entity.js";
import { Purchase } from "./purchase.entity.js";

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

    @Property()
    available_tickets!: number;
    
    @ManyToOne(() => Event, { nullable: false ,deleteRule: 'CASCADE'})
    event!: Rel<Event>;

    @OneToMany(() => Purchase, purchase => purchase.ticket_type, {orphanRemoval: false})
    purchase = new Collection<Purchase>(this);

    @BeforeCreate()
    initializeAvailableQuantity() {
         this.available_tickets= this.max_quantity;
    }


  }
