import type { Request, Response, NextFunction } from "express";

/**
 * Wrapper para manejar errores en operaciones asíncronas
 * Captura automáticamente los errores y los pasa al errorHandler
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Versión para métodos de controlador que retornan promesas
 */
export const asyncController = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Re-lanzar el error para que sea capturado por el errorHandler
      throw error;
    }
  };
}; 