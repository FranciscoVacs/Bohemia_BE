import { EventGallery } from "../../entities/eventGallery.entity.js";
import { IEventGalleryModel } from "../../interfaces/eventGallery.interface.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class EventGalleryModel extends BaseModel<EventGallery> implements IEventGalleryModel<EventGallery> {
    constructor(protected readonly em: EntityManager) {
        super(em, EventGallery);
    }

    async getByEventId(eventId: number): Promise<EventGallery[]> {
        return this.em.find(EventGallery, { event: eventId });
    }

    async deleteByEventId(eventId: number): Promise<void> {
        await this.em.nativeDelete(EventGallery, { event: eventId });
    }
}
