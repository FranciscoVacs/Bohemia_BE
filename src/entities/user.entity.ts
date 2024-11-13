import { Entity, OneToMany, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Purchase } from "./purchase.entity.js";

@Entity()
export class User extends BaseEntity {


    @Property({length:100})
    @Unique()
    email!: string;

    @Property({length:100})
    user_name!: string;

    @Property({length:100})
    user_surname!: string;

    @Property({length:100})
    password!: string;

    @Property()
    birth_date!: Date;

    @Property({default: false})
    isAdmin!: boolean;

    @OneToMany(()=> Purchase, purchase=>purchase.user, {cascade:[Cascade.ALL]})
    purchase = new Collection<Purchase>(this);
}