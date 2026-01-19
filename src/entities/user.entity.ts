import { Entity, OneToMany, Property, Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Purchase } from "./purchase.entity.js";

@Entity()
export class User extends BaseEntity {
    @Property({ length: 100 })
    @Unique()
    email!: string;

    @Property({ length: 100, fieldName: 'user_name' })
    userName!: string;

    @Property({ length: 100, fieldName: 'user_surname' })
    userSurname!: string;

    @Property({ length: 100, hidden: true })
    password!: string;

    @Property({ fieldName: 'birth_date' })
    birthDate!: Date;

    @Property({ default: false, fieldName: 'is_admin' })
    isAdmin!: boolean;

    @OneToMany(() => Purchase, purchase => purchase.user, { cascade: [Cascade.ALL] })
    purchase = new Collection<Purchase>(this);
}