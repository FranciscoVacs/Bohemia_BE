import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let message: string;
  let statusCode = 500; // Default to 500

  if (error instanceof Error) {
    message = error.message;
    if (error.message.toLowerCase().includes("not found")) {
      statusCode = 404;
    } else if (error.message.startsWith("Validation failed:")) {
      statusCode = 400;
      message = error.message.replace("Validation failed: ", "");
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
