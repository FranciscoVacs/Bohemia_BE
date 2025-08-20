import type { NextFunction, Request, Response } from "express";
import { path } from "pdfkit";
import { type AnyZodObject, ZodError } from "zod";
import { ValidationError } from "../shared/errors/AppError.js";

export const schemaValidator =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      // Los errores de Zod se manejarán en el errorHandler global
      next(error);
    }
  };
