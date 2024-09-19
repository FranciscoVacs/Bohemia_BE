import type { Request, Response, NextFunction } from "express";
import type { ICityModel } from "../interfaces/city.model.interface.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export class CityController {
  private cityModel: ICityModel;

  constructor(cityModel: ICityModel) {
    this.cityModel = cityModel;
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const citys = await this.cityModel.getAll();
      res.status(200).json({ message: "Find all citys", data: citys });
    } catch (error) {
      next(errorHandler);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const city = await this.cityModel.getById(id);
      res.status(200).send({message:'City found', data: city});
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cityInput = req.body;
      const city = await this.cityModel.create(cityInput);
      return res
        .status(201)
        .send({ message: "City created", data: city });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.cityModel.delete(id);
      return res.status(200).send({ message: "City deleted" });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      console.log(req.body); 
      await this.cityModel.update(id, req.body);
      return res.status(200).send({ message: "City updated" });
    } catch (error) {
      next(error);
    }
  };
}
