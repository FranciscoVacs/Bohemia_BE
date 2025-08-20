import type { Request, Response, NextFunction } from "express";
import type { IModel } from "../interfaces/model.interface.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { throwError, assertResourceExists } from "../shared/errors/ErrorUtils.js";

export class BaseController<T> {
  constructor(protected model: IModel<T>) {}

  getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const items = await this.model.getAll();
    res.status(200).send({ message: "Find all items", data: items });
  });

  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const item = await this.model.getById(id);
    
    // Validar que el item existe
    assertResourceExists(item, `Item with id ${id}`);
    
    res.status(200).send({ message: 'Item found', data: item });
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const itemInput = req.body;
    const item = await this.model.create(itemInput);
    return res.status(201).send({ message: "Item created", data: item });
  });

  update = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    
    // Verificar que el item existe antes de actualizarlo
    const existingItem = await this.model.getById(id);
    assertResourceExists(existingItem, `Item with id ${id}`);
    
    await this.model.update(id, req.body);
    return res.status(200).send({ message: "Item updated", data: req.body });
  });

  delete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    
    // Verificar que el item existe antes de eliminarlo
    const existingItem = await this.model.getById(id);
    assertResourceExists(existingItem, `Item with id ${id}`);
    
    await this.model.delete(id);
    return res.status(200).send({ message: "Item deleted" });
  });
}
