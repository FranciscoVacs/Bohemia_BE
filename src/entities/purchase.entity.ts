import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique, Enum } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "./user.entity.js";
import { Ticket } from "./ticket.entity.js";
import { Payment } from "mercadopago";
import { TicketType } from "./ticketType.entity.js";

@Entity()
export class Purchase extends BaseEntity {

    @Property()
    ticket_numbers!: number;

    @Enum(() => PaymentStatus)
    payment_status!: PaymentStatus;

    @Property({default: 0})
    discount_applied!: number;

    @Property({default: 0})
    total_price!: number;

    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;
    
    @ManyToOne(() => TicketType, { nullable: false })
    ticket_type!: Rel<TicketType>;

    @OneToMany(() => Ticket, (ticket) => ticket.purchase, { cascade: [Cascade.ALL] })
    ticket = new Collection<Ticket>(this);

}

export enum PaymentStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected",
}

