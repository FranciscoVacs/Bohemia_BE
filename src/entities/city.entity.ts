import { Entity, OneToMany, Property,Cascade, Collection, Unique } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Location } from "./location.entity.js";

@Entity()
export class City extends BaseEntity {

    @Property({length:100})
    @Unique()
    city_name!: string;

    @Property({length:100})
    province!: string;

    @Property()
    zip_code!: number;

    @OneToMany(()=>Location, location=>location.city, {cascade:[Cascade.ALL]})
    location = new Collection<Location>(this);
    
}