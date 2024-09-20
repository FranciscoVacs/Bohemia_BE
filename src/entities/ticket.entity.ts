import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { TicketType } from "./ticketType.entity.js";


@Entity()
export class Ticket extends BaseEntity {

    @Property({length:100})
    qr_code!: string;

    @ManyToOne(() => TicketType, { nullable: false })
    ticketType!: Rel<TicketType>;

}