import { Entity, OneToMany, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Location } from "./location.entity.js";

@Entity()
export class City extends BaseEntity {
    @Property({ length: 100, fieldName: 'city_name' })
    @Unique()
    cityName!: string;

    @Property({ length: 100 })
    province!: string;

    @Property({ fieldName: 'zip_code' })
    zipCode!: number;

    @OneToMany(() => Location, location => location.city, { cascade: [Cascade.ALL] })
    location = new Collection<Location>(this);
}