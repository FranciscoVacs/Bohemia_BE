import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
    
  let message: string;
  let statusCode = 400;

  if (error instanceof Error) {
    message = error.message;
    if (error.message.toLowerCase().includes('not found')) {
      statusCode = 404; // No encontrado
    } else {
      statusCode = 500; // Error del servidor
    }
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Unknown error";
  }
  
  res.status(statusCode).send({ message });
};
