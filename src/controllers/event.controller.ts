import type { Request, Response, NextFunction } from "express";
import type { IEventModel } from "../interfaces/event.model.interface.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export class EventController {
  private eventModel: IEventModel;

  constructor(eventModel: IEventModel) {
    this.eventModel = eventModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventModel.getAll();
      res.status(200).json({ message: "Find all events", data: events });
    } catch (error) {
      next(errorHandler);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const event = await this.eventModel.getById(id);
      res.status(200).send({message:'Event found', data: event});
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventInput = req.body;
      const event = await this.eventModel.create(eventInput);
      return res
        .status(201)
        .send({ message: "Event created", data: event });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.eventModel.delete(id);
      return res.status(200).send({ message: "Event deleted" });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      console.log(req.body); 
      await this.eventModel.update(id, req.body);
      return res.status(200).send({ message: "Event updated" });
    } catch (error) {
      next(error);
    }
  };
}
