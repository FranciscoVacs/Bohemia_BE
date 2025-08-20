import type { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError.js";
import { ZodError } from "zod";
import { errorLogger } from "./errorLogger.js";
import { ERROR_CONFIG } from "../shared/errors/ErrorConfig.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let message: string;
  let statusCode = 500;
  let isOperational = true;

  // Manejar errores personalizados de la aplicación
  if (error instanceof AppError) {
    message = error.message;
    statusCode = error.statusCode;
    isOperational = error.isOperational;
  }
  // Manejar errores de validación de Zod
  else if (error instanceof ZodError) {
    message = ERROR_CONFIG.MESSAGES.VALIDATION;
    statusCode = ERROR_CONFIG.STATUS_CODES.VALIDATION_ERROR;
    const details = error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    
    // Log del error de validación
    errorLogger.logWarning(`Validation error: ${message}`, req, { details });
    
    res.status(statusCode).json({
      message,
      statusCode,
      details,
      ...(ERROR_CONFIG.RESPONSES.INCLUDE_TIMESTAMP && { timestamp: new Date().toISOString() }),
      ...(ERROR_CONFIG.RESPONSES.INCLUDE_REQUEST_INFO && { path: req.url, method: req.method })
    });
    return;
  }
  // Manejar errores de base de datos
  else if (error && typeof error === "object" && "code" in error) {
    const dbError = error as any;
    
    switch (dbError.code) {
      case 'ER_DUP_ENTRY':
        message = 'Duplicate entry found';
        statusCode = ERROR_CONFIG.STATUS_CODES.CONFLICT;
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        message = 'Referenced record does not exist';
        statusCode = ERROR_CONFIG.STATUS_CODES.VALIDATION_ERROR;
        break;
      case 'ER_ROW_IS_REFERENCED_2':
        message = 'Cannot delete: record is referenced by other records';
        statusCode = ERROR_CONFIG.STATUS_CODES.CONFLICT;
        break;
      default:
        message = ERROR_CONFIG.MESSAGES.DATABASE;
        statusCode = ERROR_CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR;
        isOperational = false;
    }
  }
  // Manejar errores estándar de Error
  else if (error instanceof Error) {
    message = error.message;
    
    // Detectar códigos de estado basados en el mensaje
    if (error.message.toLowerCase().includes('not found')) {
      statusCode = ERROR_CONFIG.STATUS_CODES.NOT_FOUND;
    } else if (error.message.toLowerCase().includes('unauthorized')) {
      statusCode = ERROR_CONFIG.STATUS_CODES.UNAUTHORIZED;
    } else if (error.message.toLowerCase().includes('forbidden')) {
      statusCode = ERROR_CONFIG.STATUS_CODES.FORBIDDEN;
    } else if (error.message.toLowerCase().includes('validation')) {
      statusCode = ERROR_CONFIG.STATUS_CODES.VALIDATION_ERROR;
    } else {
      statusCode = ERROR_CONFIG.STATUS_CODES.INTERNAL_SERVER_ERROR;
      isOperational = false;
    }
  }
  // Manejar otros tipos de error
  else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = ERROR_CONFIG.MESSAGES.DEFAULT;
    isOperational = false;
  }

  // Log del error usando el sistema centralizado
  errorLogger.logError(error, req, statusCode, isOperational);

  // Respuesta al cliente
  const errorResponse: any = {
    message,
    statusCode
  };

  // Agregar campos opcionales según la configuración
  if (ERROR_CONFIG.RESPONSES.INCLUDE_TIMESTAMP) {
    errorResponse.timestamp = new Date().toISOString();
  }
  
  if (ERROR_CONFIG.RESPONSES.INCLUDE_REQUEST_INFO) {
    errorResponse.path = req.url;
    errorResponse.method = req.method;
  }

  // En desarrollo, incluir más detalles
  if (ERROR_CONFIG.RESPONSES.INCLUDE_TECHNICAL_DETAILS) {
    errorResponse.stack = error instanceof Error ? error.stack : undefined;
    errorResponse.errorType = error instanceof Error ? error.constructor.name : typeof error;
  }

  res.status(statusCode).json(errorResponse);
};
