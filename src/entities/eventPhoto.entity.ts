import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { Event } from "./event.entity.js";

@Entity()
export class EventPhoto extends BaseEntity {
    @Property({ length: 255 })
    cloudinaryUrl!: string; // URL pública para mostrar la imagen

    @Property({ length: 255 })
    publicId!: string; // ID de Cloudinary para operaciones (eliminar, etc.)

    @Property({ length: 255 })
    originalName!: string;

    @ManyToOne(() => Event, { nullable: false, deleteRule: 'CASCADE' })
    event!: Rel<Event>;
}
