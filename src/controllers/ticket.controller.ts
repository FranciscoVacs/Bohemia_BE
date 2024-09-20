import type { Request, Response, NextFunction } from "express";
import type { ITicketModel } from "../interfaces/ticket.model.interface.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export class TicketController {
  private ticketModel: ITicketModel;

  constructor(ticketModel: ITicketModel) {
    this.ticketModel = ticketModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await this.ticketModel.getAll();
      res.status(200).json({ message: "Find all tickets", data: tickets });
    } catch (error) {
      next(errorHandler);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const ticket = await this.ticketModel.getById(id);
      res.status(200).send({message:'Ticket found', data: ticket});
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketInput = req.body;
      const ticket = await this.ticketModel.create(ticketInput);
      return res
        .status(201)
        .send({ message: "Ticket created", data: ticket });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.ticketModel.delete(id);
      return res.status(200).send({ message: "Ticket deleted" });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      console.log(req.body); 
      await this.ticketModel.update(id, req.body);
      return res.status(200).send({ message: "Ticket updated" });
    } catch (error) {
      next(error);
    }
  };
}
