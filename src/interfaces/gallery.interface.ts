import type { IModel } from "./model.interface.js";
import { Gallery } from "../entities/gellery.entity.js";

export interface IGalleryModel<T> extends IModel<T> {
    // Aquí puedes agregar métodos específicos para la galería si es necesario
    getByEventId(eventId: number): Promise<Gallery[]>;
}
