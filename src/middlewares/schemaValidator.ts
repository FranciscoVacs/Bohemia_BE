import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";


export const schemaValidator =
  (schema: AnyZodObject) =>
  async(req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("schema", req.body);
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
    });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res
          .status(400)
          .json(error.issues.map((issue) => ({ message: issue.message, path: issue.path })));
      }
      return res.status(400).json({ message: "internal server error" });
    }
  };

  
