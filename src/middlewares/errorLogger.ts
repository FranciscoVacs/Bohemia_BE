import type { Request, Response, NextFunction } from "express";
import { ERROR_CONFIG } from "../shared/errors/ErrorConfig.js";

interface ErrorLogData {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  statusCode: number;
  path: string;
  method: string;
  ip: string;
  userAgent?: string;
  userId?: string;
  stack?: string;
  isOperational: boolean;
  errorType: string;
  details?: any;
}

export const errorLogger = {
  /**
   * Log de errores con formato estructurado
   */
  logError: (error: any, req: Request, statusCode: number, isOperational: boolean = true) => {
    const logData: ErrorLogData = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: error.message || 'Unknown error',
      statusCode,
      path: req.url,
      method: req.method,
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id,
      isOperational,
      errorType: error.constructor.name,
      details: ERROR_CONFIG.LOGGING.INCLUDE_STACK_TRACE ? error.stack : undefined
    };

    // En desarrollo, log completo
    if (ERROR_CONFIG.LOGGING.LOG_ALL_IN_DEV) {
      console.error('🚨 ERROR LOG:', JSON.stringify(logData, null, 2));
    }
    // En producción, solo errores no operacionales
    else if (ERROR_CONFIG.LOGGING.LOG_NON_OPERATIONAL_ONLY && !isOperational) {
      console.error('🚨 CRITICAL ERROR:', {
        message: logData.message,
        statusCode: logData.statusCode,
        path: logData.path,
        timestamp: logData.timestamp
      });
    }

    // Aquí podrías enviar a un servicio de logging externo como Winston, Loggly, etc.
    // sendToExternalLogger(logData);
  },

  /**
   * Log de warnings
   */
  logWarning: (message: string, req: Request, details?: any) => {
    if (ERROR_CONFIG.LOGGING.LOG_ALL_IN_DEV) {
      console.warn('⚠️  WARNING:', {
        timestamp: new Date().toISOString(),
        message,
        path: req.url,
        method: req.method,
        details
      });
    }
  },

  /**
   * Log de información de errores para debugging
   */
  logDebug: (message: string, data?: any) => {
    if (ERROR_CONFIG.LOGGING.LOG_ALL_IN_DEV) {
      console.log('🔍 DEBUG:', { message, data, timestamp: new Date().toISOString() });
    }
  }
};

/**
 * Middleware para logging automático de errores
 */
export const errorLoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Interceptar respuestas de error
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode >= 400) {
      errorLogger.logWarning(`HTTP ${res.statusCode} response`, req, { data });
    }
    return originalSend.call(this, data);
  };
  
  next();
}; 