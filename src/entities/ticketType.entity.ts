import { Entity, Enum, OneToMany, ManyToOne, Property, Collection, BeforeCreate } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
import { Ticket } from "./ticket.entity.js";
import { Purchase } from "./purchase.entity.js";

// Enum para estado del tipo de ticket en la cola
export enum TicketTypeStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    SOLD_OUT = 'sold_out',
    CLOSED = 'closed'
}

@Entity()
export class TicketType extends BaseEntity {
    @Property({ fieldName: 'ticket_type_name' })
    ticketTypeName!: string;

    @Property()
    price!: number;

    @Property({ fieldName: 'max_quantity' })
    maxQuantity!: number;

    @Property({ fieldName: 'available_tickets' })
    availableTickets!: number;

    @Property({ fieldName: 'sort_order' })
    sortOrder!: number;

    @Enum({ items: () => TicketTypeStatus, fieldName: 'status' })
    status: TicketTypeStatus = TicketTypeStatus.PENDING;

    @Property({ fieldName: 'activated_at', nullable: true })
    activatedAt?: Date;

    @Property({ fieldName: 'closed_at', nullable: true })
    closedAt?: Date;

    @ManyToOne(() => Event, { nullable: false, deleteRule: 'CASCADE' })
    event!: Rel<Event>;

    @OneToMany(() => Purchase, purchase => purchase.ticketType, { orphanRemoval: false })
    purchase = new Collection<Purchase>(this);

    @BeforeCreate()
    initializeAvailableQuantity() {
        this.availableTickets = this.maxQuantity;
    }

    /**
     * La venta está activa si el estado es ACTIVE y hay tickets disponibles.
     */
    isSaleActive(): boolean {
        return this.status === TicketTypeStatus.ACTIVE && this.availableTickets > 0;
    }
}
