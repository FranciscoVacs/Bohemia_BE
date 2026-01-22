import { EventPhoto } from "../../entities/eventPhoto.entity.js";
import { IEventPhotoModel } from "../../interfaces/eventPhoto.interface.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager } from "@mikro-orm/mysql";

export class EventPhotoModel extends BaseModel<EventPhoto> implements IEventPhotoModel<EventPhoto> {
    constructor(protected readonly em: EntityManager) {
        super(em, EventPhoto);
    }

    async getByEventId(eventId: number): Promise<EventPhoto[]> {
        return this.em.find(EventPhoto, { event: eventId });
    }

    async deleteByEventId(eventId: number): Promise<void> {
        await this.em.nativeDelete(EventPhoto, { event: eventId });
    }
}
