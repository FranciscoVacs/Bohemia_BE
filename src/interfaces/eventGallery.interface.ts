import type { IModel } from "./model.interface.js";
import { EventGallery } from "../entities/eventGallery.entity.js";

export interface IEventGalleryModel<T> extends IModel<T> {
    // Métodos específicos para galería de eventos
    getByEventId(eventId: number): Promise<EventGallery[]>;
    deleteByEventId(eventId: number): Promise<void>;
}
