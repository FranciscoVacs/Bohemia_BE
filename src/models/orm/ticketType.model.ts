
import { TicketType, TicketTypeStatus } from "../../entities/ticketType.entity.js";
import { BaseModel } from "./base.Model.js";
import type { EntityManager, RequiredEntityData } from "@mikro-orm/mysql";
import { Event } from "../../entities/event.entity.js";
import type { ITicketTypeModel } from "../../interfaces/ticketType.interface.js";
import { NotFoundError, BadRequestError } from "../../shared/errors/AppError.js";

export class TicketTypeModel extends BaseModel<TicketType> implements ITicketTypeModel<TicketType> {
  constructor(em: EntityManager) {
    super(em, TicketType);
  }

  async getTotalMaxQuantityByEvent(eventId: number): Promise<number> {
    const ticketTypes = await this.em.find(TicketType, { event: eventId });
    return ticketTypes.reduce((total, ticketType) => total + ticketType.maxQuantity, 0);
  }

  async getEventWithLocation(eventId: number): Promise<Event | null> {
    return await this.em.findOne(Event, eventId, { populate: ['location'] });
  }

  /**
   * Activa el siguiente ticket type PENDING en la cola para un evento.
   * Retorna el ticket type activado, o null si no hay más en cola.
   */
  async activateNext(eventId: number): Promise<TicketType | null> {
    const nextPending = await this.em.findOne(
      TicketType,
      { event: eventId, status: TicketTypeStatus.PENDING },
      { orderBy: { sortOrder: 'ASC' } }
    );

    if (!nextPending) return null;

    nextPending.status = TicketTypeStatus.ACTIVE;
    nextPending.activatedAt = new Date();
    await this.em.flush();

    return nextPending;
  }

  /**
   * Cierra un ticket type activo: transfiere tickets restantes al siguiente PENDING,
   * lo activa, y marca el actual como CLOSED.
   */
  async closeTicketType(ticketTypeId: string): Promise<TicketType> {
    const parsedId = Number.parseInt(ticketTypeId);
    const ticketType = await this.em.findOne(TicketType, parsedId, { populate: ['event'] });

    if (!ticketType) {
      throw new NotFoundError(`Ticket type con ID ${ticketTypeId} no encontrado`);
    }

    if (ticketType.status !== TicketTypeStatus.ACTIVE) {
      throw new BadRequestError('Solo se puede cerrar un ticket type con estado ACTIVE');
    }

    const remainingTickets = ticketType.availableTickets;

    // Cerrar el ticket type actual
    ticketType.status = TicketTypeStatus.CLOSED;
    ticketType.closedAt = new Date();
    ticketType.availableTickets = 0;

    // Buscar el siguiente PENDING para transferirle los tickets restantes
    const nextPending = await this.em.findOne(
      TicketType,
      { event: ticketType.event.id, status: TicketTypeStatus.PENDING },
      { orderBy: { sortOrder: 'ASC' } }
    );

    if (nextPending && remainingTickets > 0) {
      nextPending.maxQuantity += remainingTickets;
      nextPending.availableTickets += remainingTickets;
    }

    if (nextPending) {
      nextPending.status = TicketTypeStatus.ACTIVE;
      nextPending.activatedAt = new Date();
    }

    await this.em.flush();

    return ticketType;
  }

  /**
   * Verifica si un evento ya tiene un ticket type activo.
   */
  async hasActiveTicketType(eventId: number): Promise<boolean> {
    const active = await this.em.findOne(TicketType, {
      event: eventId,
      status: TicketTypeStatus.ACTIVE,
    });
    return active !== null;
  }
}
