import {
    Entity,
    ManyToOne,
    Property,
    type Rel,
    BeforeCreate,
} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { TicketType } from "./ticketType.entity.js";
import { Purchase } from "./purchase.entity.js";

@Entity()
export class Ticket extends BaseEntity {
    @Property({ length: 100 })
    qr_code!: string;

    @Property()
    number_in_purchase!: number;

    @Property()
    number_in_ticket_type!: number;

    @ManyToOne(() => TicketType, { nullable: false, deleteRule: "CASCADE" })
    ticket_type!: Rel<TicketType>;

    @ManyToOne(() => Purchase, { nullable: false })
    purchase!: Rel<Purchase>;

    @BeforeCreate()
    async setNumbers() {
        // Calcula el número en la compra
        this.number_in_purchase =
            (await this.purchase.ticket.loadCount()) + 1;

        // Calcula el número en el tipo de entrada
        this.number_in_ticket_type =
            (await this.ticket_type.ticket.loadCount()) + 1;
    }

    
   // @BeforeCreate()
    //async updateTicketTypeAvailability() {
      //  this.ticket_type.decreaseAvailableQuantity();
    //}
}
