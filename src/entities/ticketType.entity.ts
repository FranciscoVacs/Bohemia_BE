import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique, BeforeCreate } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
import { Ticket } from "./ticket.entity.js";
import { Purchase } from "./purchase.entity.js";

@Entity()
export class TicketType extends BaseEntity {
    @Property({ fieldName: 'ticket_type_name' })
    ticketTypeName!: string;

    @Property({ fieldName: 'begin_datetime' })
    beginDatetime!: Date;

    @Property({ fieldName: 'finish_datetime' })
    finishDatetime!: Date;

    @Property()
    price!: number;

    @Property({ fieldName: 'max_quantity' })
    maxQuantity!: number;

    @Property({ fieldName: 'available_tickets' })
    availableTickets!: number;
    
    @ManyToOne(() => Event, { nullable: false, deleteRule: 'CASCADE' })
    event!: Rel<Event>;

    @OneToMany(() => Purchase, purchase => purchase.ticketType, { orphanRemoval: false })
    purchase = new Collection<Purchase>(this);

    @BeforeCreate()
    initializeAvailableQuantity() {
        this.availableTickets = this.maxQuantity;
    }
}
