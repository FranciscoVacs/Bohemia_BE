import type { Request, Response, NextFunction } from "express";
import type { IModel } from "../interfaces/model.interface.js";

export class BaseController<T> {
  constructor(protected model: IModel<T>) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.model.getAll();
      res.status(200).json({ message: "Find all items", data: items });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const item = await this.model.getById(id);
      res.status(200).send({ message: 'Item found', data: item });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemInput = req.body;
      const item = await this.model.create(itemInput);
      return res.status(201).send({ message: "Item created", data: item });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.model.update(id, req.body);
      return res.status(200).send({ message: "Item updated" });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.model.delete(id);
      return res.status(200).send({ message: "Item deleted" });
    } catch (error) {
      next(error);
    }
  };
}
