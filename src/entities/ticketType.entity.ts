import { Entity, Enum, OneToMany, ManyToOne, Property, Collection, BeforeCreate } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
import { Ticket } from "./ticket.entity.js";
import { Purchase } from "./purchase.entity.js";

// Enum para modo de venta
export enum SaleMode {
    MANUAL = 'manual',
    SCHEDULED = 'scheduled'
}

@Entity()
export class TicketType extends BaseEntity {
    @Property({ fieldName: 'ticket_type_name' })
    ticketTypeName!: string;

    @Property({ fieldName: 'begin_datetime', nullable: true })
    beginDatetime?: Date;

    @Property({ fieldName: 'finish_datetime', nullable: true })
    finishDatetime?: Date;

    @Property()
    price!: number;

    @Property({ fieldName: 'max_quantity' })
    maxQuantity!: number;

    @Property({ fieldName: 'available_tickets' })
    availableTickets!: number;

    @Enum({ items: () => SaleMode, fieldName: 'sale_mode' })
    saleMode: SaleMode = SaleMode.SCHEDULED;

    @Property({ fieldName: 'is_manually_activated' })
    isManuallyActivated: boolean = false;

    @ManyToOne(() => Event, { nullable: false, deleteRule: 'CASCADE' })
    event!: Rel<Event>;

    @OneToMany(() => Purchase, purchase => purchase.ticketType, { orphanRemoval: false })
    purchase = new Collection<Purchase>(this);

    @BeforeCreate()
    initializeAvailableQuantity() {
        this.availableTickets = this.maxQuantity;
    }

    /**
     * Calcula si la venta está activa basándose en el modo de venta.
     * - SCHEDULED: activo si estamos dentro del rango de fechas
     * - MANUAL: activo si isManuallyActivated es true
     * - Siempre inactivo si no hay tickets disponibles
     */
    isSaleActive(): boolean {
        // Si no hay tickets disponibles, siempre inactivo
        if (this.availableTickets <= 0) return false;

        if (this.saleMode === SaleMode.MANUAL) {
            return this.isManuallyActivated;
        }

        // Modo SCHEDULED
        if (!this.beginDatetime || !this.finishDatetime) return false;

        const now = new Date();
        return now >= this.beginDatetime && now <= this.finishDatetime;
    }
}
