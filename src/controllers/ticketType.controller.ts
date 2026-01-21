import type { TicketType } from "../entities/ticketType.entity.js";
import { SaleMode } from "../entities/ticketType.entity.js";
import { BaseController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { RequiredEntityData } from "@mikro-orm/core";
import { BadRequestError, ValidationError, NotFoundError } from "../shared/errors/AppError.js";
import type { ITicketTypeModel } from "../interfaces/ticketType.interface.js";
import { assertResourceExists } from "../shared/errors/ErrorUtils.js";

export class TicketTypeController extends BaseController<TicketType> {
  constructor(protected model: ITicketTypeModel<TicketType>) {
    super(model);
  }

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {
      ticketTypeName,
      beginDatetime,
      finishDatetime,
      price,
      maxQuantity,
      event,
      saleMode = 'scheduled',
      isManuallyActivated = false
    } = req.body;

    // Obtener el evento con su location
    const eventWithLocation = await this.model.getEventWithLocation(event);
    if (!eventWithLocation) {
      throw new NotFoundError(`Evento con ID ${event} no encontrado`);
    }

    // Calcular la suma total actual de maxQuantity de todos los ticket types del evento
    const currentTotalMaxQuantity = await this.model.getTotalMaxQuantityByEvent(event);

    // Verificar que la suma total más el nuevo ticket type no supere la capacidad máxima
    const newTotalMaxQuantity = currentTotalMaxQuantity + maxQuantity;
    const locationMaxCapacity = eventWithLocation.location.maxCapacity;

    if (newTotalMaxQuantity > locationMaxCapacity) {
      throw new ValidationError(
        `La capacidad total de los ticket types (${newTotalMaxQuantity}) superaría la capacidad máxima de la ubicación (${locationMaxCapacity})`
      );
    }

    const ticketTypeData = {
      ticketTypeName,
      price,
      maxQuantity,
      event,
      saleMode: saleMode as SaleMode,
      isManuallyActivated,
    } as RequiredEntityData<TicketType>;

    // Solo agregar fechas si están definidas
    if (beginDatetime) {
      ticketTypeData.beginDatetime = new Date(beginDatetime);
    }
    if (finishDatetime) {
      ticketTypeData.finishDatetime = new Date(finishDatetime);
    }

    const ticketType = await this.model.create(ticketTypeData);

    return res.status(201).send({
      message: "Tipo de ticket creado exitosamente",
      data: ticketType,
      capacityInfo: {
        newTotalCapacity: newTotalMaxQuantity,
        locationMaxCapacity: locationMaxCapacity,
        remainingCapacity: locationMaxCapacity - newTotalMaxQuantity
      }
    });

  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const updates = { ...req.body };

    // Verificar que el ticket type existe antes de actualizarlo
    const existingTicketType = await this.model.getById(id);
    assertResourceExists(existingTicketType, `Ticket type with id ${id}`);

    // Convertir fechas a Date si están presentes
    if (updates.beginDatetime) {
      updates.beginDatetime = new Date(updates.beginDatetime);
    }
    if (updates.finishDatetime) {
      updates.finishDatetime = new Date(updates.finishDatetime);
    }

    // Si se está actualizando maxQuantity, validar capacidad
    if (updates.maxQuantity !== undefined) {
      const eventId = updates.event || existingTicketType!.event.id;

      // Obtener el evento con su location
      const eventWithLocation = await this.model.getEventWithLocation(eventId);
      if (!eventWithLocation) {
        throw new NotFoundError(`Evento con ID ${eventId} no encontrado`);
      }

      // Calcular la suma total actual excluyendo el ticket type que se está actualizando
      const allTicketTypes = await this.model.getTotalMaxQuantityByEvent(eventId);
      const currentTotalWithoutThis = allTicketTypes - existingTicketType!.maxQuantity;

      // Calcular la nueva capacidad total con el valor actualizado
      const newTotalMaxQuantity = currentTotalWithoutThis + updates.maxQuantity;
      const locationMaxCapacity = eventWithLocation.location.maxCapacity;

      if (newTotalMaxQuantity > locationMaxCapacity) {
        throw new ValidationError(
          `La capacidad total actualizada de los ticket types (${newTotalMaxQuantity}) superaría la capacidad máxima de la ubicación (${locationMaxCapacity})`
        );
      }
    }

    await this.model.update(id, updates);
    return res.status(200).send({ message: "Ticket type actualizado exitosamente", data: updates });
  });

}