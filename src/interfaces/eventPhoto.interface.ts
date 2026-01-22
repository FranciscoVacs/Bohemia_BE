import type { IModel } from "./model.interface.js";
import { EventPhoto } from "../entities/eventPhoto.entity.js";

export interface IEventPhotoModel<T> extends IModel<T> {
    // Métodos específicos para fotos de eventos
    getByEventId(eventId: number): Promise<EventPhoto[]>;
    deleteByEventId(eventId: number): Promise<void>;
}
