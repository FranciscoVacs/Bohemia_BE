import { Entity, OneToMany, ManyToOne, Property,Cascade, Collection, Unique, Enum } from "@mikro-orm/core";
import type   { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { User } from "./user.entity.js";
import { Ticket } from "./ticket.entity.js";

@Entity()
export class Purchase extends BaseEntity {

    @Enum(() => PaymentMethod)
    payment_method!: PaymentMethod;

    @Property()
    discount_applied!: 0;

    @Property()
    total_price!: number;

    @ManyToOne(() => User, { nullable: false })
    user!: Rel<User>;

    @OneToMany(() => Ticket, (ticket) => ticket.purchase, { cascade: [Cascade.ALL] })
    ticket = new Collection<Ticket>(this);

}

export enum PaymentMethod {
    VISA_CREDITO = "Visa Crédito",
    VISA_DEBITO = "Visa Débito",
    MASTERCARD_CREDITO = "MasterCard Crédito",
    MASTERCARD_DEBITO = "MasterCard Débito",
}