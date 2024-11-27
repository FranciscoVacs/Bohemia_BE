import type { NextFunction, Request, Response } from "express";
import { path } from "pdfkit";
import { type AnyZodObject, ZodError } from "zod";

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
      if (error instanceof ZodError) {
        return res.status(400).send(
          error.issues.map((issue) => ({
            message: issue.message,
            path: issue.path,
          })),
        );
      }
      return res.status(400).send({ message: "internal server error" });
    }}
