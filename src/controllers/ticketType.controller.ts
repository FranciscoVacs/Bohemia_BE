import type { TicketType } from "../entities/ticketType.entity.js";
import { BaseController } from "./base.controller.js";
import type { IModel } from "../interfaces/model.interface.js";
import type { Request, Response, NextFunction } from "express";
import { Event } from "../entities/event.entity.js";
import dayjs from "dayjs";
import { wrap } from "@mikro-orm/core";

export class TicketTypeController extends BaseController<TicketType> {
  constructor(protected model: IModel<TicketType>) {
    super(model);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        ticketType_name,
        begin_datetime,
        finish_datetime,
        price,
        max_quantity,
        event: eventId,
      } = req.body;

      const eventRepo = this.model.em.getRepository(Event);
      const event = await eventRepo.findOne(eventId, {
        populate: ["location", "ticketType"],
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // 1. Event Deadline Validation
      if (dayjs(finish_datetime).isAfter(event.begin_datetime)) {
        throw new Error(
          "Validation failed: Ticket type finish datetime cannot be after the event begin datetime"
        );
      }

      // 2. Sequential Dating Validation
      if (event.ticketType.length > 0) {
        // Sort to find the latest ticket type
        const sortedTicketTypes = [...event.ticketType.getItems()].sort((a, b) =>
          dayjs(b.finish_datetime).diff(dayjs(a.finish_datetime))
        );
        const latestTicketType = sortedTicketTypes[0];
        if (!dayjs(begin_datetime).isSame(latestTicketType.finish_datetime)) {
          throw new Error(
            "Validation failed: Ticket type begin datetime must be the same as the previous ticket type's finish datetime"
          );
        }
      }

      // 3. Capacity Check Validation
      const currentTotalTickets = event.ticketType
        .getItems()
        .reduce((sum, tt) => sum + tt.max_quantity, 0);
      const newTotalTickets = currentTotalTickets + max_quantity;

      if (newTotalTickets > event.location.max_capacity) {
        throw new Error("Validation failed: Total tickets exceed location capacity");
      }

      // All validations passed, create the ticket type
      const newTicketType = await this.model.create(req.body);

      // Update event's tickets_on_sale
      event.tickets_on_sale = newTotalTickets;
      await eventRepo.flush();

      return res
        .status(201)
        .send({ message: "Item created", data: newTicketType });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // 1. Fetch all necessary data
      const ticketToUpdate = await this.model.getById(id);
      if (!ticketToUpdate) {
        throw new Error("TicketType not found");
      }

      const eventRepo = this.model.em.getRepository(Event);
      const event = await eventRepo.findOne(ticketToUpdate.event.id, {
        populate: ["location", "ticketType"],
      });

      if (!event) {
        // This case should be rare if data is consistent
        throw new Error("Associated event not found");
      }

      // 2. Construct hypothetical state
      const hypotheticalTicketTypes = event.ticketType.getItems().map((tt) => {
        if (tt.id === ticketToUpdate.id) {
          // This is the one being updated, return a merged object
          return { ...tt, ...updateData };
        }
        return tt;
      });

      // 3. Validate hypothetical state
      // 3a. Capacity Check
      const newTotalTickets = hypotheticalTicketTypes.reduce(
        (sum, tt) => sum + tt.max_quantity,
        0
      );
      if (newTotalTickets > event.location.max_capacity) {
        throw new Error("Validation failed: Total tickets exceed location capacity");
      }

      // 3b. Date Sequencing Check
      const sortedHypothetical = [...hypotheticalTicketTypes].sort((a, b) =>
        dayjs(a.begin_datetime).diff(dayjs(b.begin_datetime))
      );

      for (let i = 0; i < sortedHypothetical.length; i++) {
        const currentTT = sortedHypothetical[i];
        // Check that end date is before event start date
        if (dayjs(currentTT.finish_datetime).isAfter(event.begin_datetime)) {
          throw new Error(
            "Validation failed: A ticket type's finish datetime cannot be after the event begin datetime"
          );
        }
        // Check if the chain is broken
        if (i > 0) {
          const prevTT = sortedHypothetical[i - 1];
          if (!dayjs(currentTT.begin_datetime).isSame(prevTT.finish_datetime)) {
            throw new Error(
              "Validation failed: Updating this ticket type breaks the sequential date chain"
            );
          }
        }
      }

      // 4. All validations passed, apply the update
      this.model.em.assign(ticketToUpdate, updateData);

      // 5. Update event's ticket counter
      event.tickets_on_sale = newTotalTickets;

      // 6. Flush all changes to the DB
      await this.model.em.flush();

      return res.status(200).send({ message: "Item updated" });
    } catch (error) {
      next(error);
    }
  };
}
