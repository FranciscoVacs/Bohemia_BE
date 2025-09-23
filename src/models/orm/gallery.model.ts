import { Gallery } from "../../entities/gellery.entity.js";
import { IGalleryModel } from "../../interfaces/gallery.interface.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class GalleryModel extends BaseModel<Gallery> implements IGalleryModel<Gallery> {
  constructor(protected readonly em: EntityManager) {
    super(em, Gallery);
  }

  async getByEventId(eventId: number): Promise<Gallery[]> {
    return this.em.find(Gallery, { event: eventId });
  }
}