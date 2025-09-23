import { EventImage } from "../../entities/eventImage.entity.js";
import { IEventImageModel } from "../../interfaces/eventImage.interface.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";

export class EventImageModel extends BaseModel<EventImage> implements IEventImageModel<EventImage> {
  constructor(protected readonly em: EntityManager) {
    super(em, EventImage);
  }

  async getByEventId(eventId: number): Promise<EventImage[]> {
    return this.em.find(EventImage, { event: eventId });
  }

  async deleteByEventId(eventId: number): Promise<void> {
    await this.em.nativeDelete(EventImage, { event: eventId });
  }
}