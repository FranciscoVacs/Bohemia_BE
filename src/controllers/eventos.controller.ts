import type { Request, Response } from "express";
import { Eventos } from "../entities/eventos.entity.js";
import type { IEventoModel } from "../interfaces/eventos.model.interface.js";

export class EventoController {
  private eventoModel: IEventoModel;

  constructor(eventoModel: IEventoModel) {
    this.eventoModel = eventoModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const eventos = await this.eventoModel.getAll();
      res.send(eventos);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    console.log("get all eventos");
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const evento = await this.eventoModel.getById(id);
      if (!evento) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }
      res.send(evento);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const input = req.body;
      const eventoInput = new Eventos(
        input.begin_datetime,
        input.finish_datetime,
        input.event_description,
        input.min_age,
        input.location_id,
      );
      const evento = await this.eventoModel.create(eventoInput);
      return res.status(201).send({ message: "evento creado", data: evento });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const evento = await this.eventoModel.delete(id);
      if (!evento) {
        return res.status(404).json({ message: "Evento no encontrado" });
      }
      return res
        .status(200)
        .send({ message: "Evento eliminado", data: evento });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const evento = await this.eventoModel.update(req.params.id, req.body);
      if (!evento) {
        return res.status(404).send({ message: "Evento no encontrado" });
      }
      return res
        .status(200)
        .send({ message: "Evento actualizado", data: evento });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
