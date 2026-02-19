import { Entity, OneToMany, ManyToOne, Property, Cascade, Collection, Unique } from "@mikro-orm/core";
import type { Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js"
import { Event } from "./event.entity.js";
import { City } from "./city.entity.js";

@Entity()
export class Location extends BaseEntity {
    @Property({ length: 100, fieldName: 'location_name' })
    locationName!: string;

    @Property({ length: 100 })
    @Unique()
    address!: string;

    @Property({ fieldName: 'max_capacity' })
    maxCapacity!: number;

    @Property({ columnType: 'double', nullable: true })
    latitude?: number;

    @Property({ columnType: 'double', nullable: true })
    longitude?: number;

    @ManyToOne(() => City, { nullable: false })
    city!: Rel<City>;

    @OneToMany(() => Event, event => event.location, { cascade: [Cascade.ALL] })
    event = new Collection<Event>(this);
}