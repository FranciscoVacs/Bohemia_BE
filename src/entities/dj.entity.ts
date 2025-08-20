import { Entity, OneToMany, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
@Entity()
export class Dj extends BaseEntity {
    @Property({ length: 100, fieldName: 'dj_name' })
    djName!: string;

    @Property({ length: 100, fieldName: 'dj_surname' })
    djSurname!: string;

    @Property({ fieldName: 'dj_apodo' })
    djApodo!: string;

    @OneToMany(() => Event, event => event.dj, { cascade: [Cascade.ALL] })
    event = new Collection<Event>(this);
}