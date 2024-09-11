import type { Request, Response, NextFunction } from "express";
import type { ILocationModel } from "../interfaces/location.model.interface.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export class LocationController {
  private locationModel: ILocationModel;

  constructor(locationModel: ILocationModel) {
    this.locationModel = locationModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locations = await this.locationModel.getAll();
      res.status(200).json({ message: "Find all locations", data: locations });
    } catch (error) {
      next(errorHandler);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const location = await this.locationModel.getById(id);
      res.status(200).send({message:'Location found', data: location});
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const locationInput = req.body;
      const location = await this.locationModel.create(locationInput);
      return res
        .status(201)
        .send({ message: "Location created", data: location });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.locationModel.delete(id);
      return res.status(200).send({ message: "Location deleted" });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      console.log(req.body); 
      await this.locationModel.update(id, req.body);
      return res.status(200).send({ message: "Location updated" });
    } catch (error) {
      next(error);
    }
  };
}
