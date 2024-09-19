import type { Request, Response, NextFunction } from "express";
import type { ITicketTypeModel } from "../interfaces/ticketType.model.interface.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export class TicketTypeController {
  private ticketTypeModel: ITicketTypeModel;

  constructor(ticketTypeModel: ITicketTypeModel) {
    this.ticketTypeModel = ticketTypeModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketTypes = await this.ticketTypeModel.getAll();
      res.status(200).json({ message: "Find all ticketTypes", data: ticketTypes });
    } catch (error) {
      next(errorHandler);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const ticketType = await this.ticketTypeModel.getById(id);
      res.status(200).send({message:'TicketType found', data: ticketType});
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketTypeInput = req.body;
      const ticketType = await this.ticketTypeModel.create(ticketTypeInput);
      return res
        .status(201)
        .send({ message: "TicketType created", data: ticketType });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.ticketTypeModel.delete(id);
      return res.status(200).send({ message: "TicketType deleted" });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      console.log(req.body); 
      await this.ticketTypeModel.update(id, req.body);
      return res.status(200).send({ message: "TicketType updated" });
    } catch (error) {
      next(error);
    }
  };
}
