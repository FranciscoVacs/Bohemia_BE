import type { Request, Response } from "express";
import { Event } from "../entities/event.entity.js";
import type { IEventModel } from "../interfaces/event.model.interface.js";

export class EventController {
  private eventModel: IEventModel;

  constructor(eventModel: IEventModel) {
    this.eventModel = eventModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const event = await this.eventModel.getAll();
      res.send(event);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const event = await this.eventModel.getById(id);
      if (!event) {
        return res.status(404).json({ message: "Event no encontrado" });
      }
      res.send(event);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const input = req.body;
      const eventInput = new Event(
        input.begin_datetime,
        input.finish_datetime,
        input.event_description,
        input.min_age,
        input.location_id,
      );
      const event = await this.eventModel.create(eventInput);
      return res.status(201).send({ message: "event creado", data: event });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const event = await this.eventModel.delete(id);
      if (!event) {
        return res.status(404).json({ message: "Event no encontrado" });
      }
      return res
        .status(200)
        .send({ message: "Event eliminado", data: event });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const event = await this.eventModel.update(req.params.id, req.body);
      if (!event) {
        return res.status(404).send({ message: "Event no encontrado" });
      }
      return res
        .status(200)
        .send({ message: "Event actualizado", data: event });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
