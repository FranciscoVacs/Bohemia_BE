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
    @Property({ length: 100, fieldName: 'qr_code' })
    qrCode!: string;

    @ManyToOne(() => Purchase, { nullable: false, deleteRule: 'CASCADE' })
    purchase!: Rel<Purchase>;
}
