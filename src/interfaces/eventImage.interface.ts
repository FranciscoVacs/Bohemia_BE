import type { IModel } from "./model.interface.js";
import { EventImage } from "../entities/eventImage.entity.js";

export interface IEventImageModel<T> extends IModel<T> {
    // Métodos específicos para imágenes de eventos
    getByEventId(eventId: number): Promise<EventImage[]>;
    deleteByEventId(eventId: number): Promise<void>;
}