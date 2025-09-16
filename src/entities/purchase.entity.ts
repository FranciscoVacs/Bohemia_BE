import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique, Enum } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "./user.entity.js";
import { Ticket } from "./ticket.entity.js";
import { Payment } from "mercadopago";
import { TicketType } from "./ticketType.entity.js";

@Entity()
export class Purchase extends BaseEntity {
    @Property({ fieldName: 'ticket_numbers' })
    ticketNumbers!: number;

    @Enum(() => PaymentStatus)
    @Property({ fieldName: 'payment_status' })
    paymentStatus!: PaymentStatus;

    @Property({ default: 0, fieldName: 'discount_applied' })
    discountApplied!: number;

    @Property({ default: 0, fieldName: 'service_fee' })
    serviceFee!: number;

    @Property({ default: 0, fieldName: 'total_price' })
    totalPrice!: number;

    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
    
    @ManyToOne(() => TicketType, { nullable: false, fieldName: 'ticket_type_id' })
    ticketType!: Rel<TicketType>;

    @OneToMany(() => Ticket, (ticket) => ticket.purchase, { cascade: [Cascade.ALL] })
    ticket = new Collection<Ticket>(this);
}

export enum PaymentStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}

