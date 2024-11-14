import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { TicketType } from "./ticketType.entity.js";
import { Purchase } from "./purchase.entity.js";


@Entity()
export class Ticket extends BaseEntity {

    @Property({length:100})
    qr_code!: string;

    @ManyToOne(() => TicketType, { nullable: false, deleteRule: 'CASCADE' })
    ticketType!: Rel<TicketType>;

    @ManyToOne(() => Purchase, { nullable: false })
    purchase!: Rel<Purchase>;
}