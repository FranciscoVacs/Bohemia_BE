export const ERROR_CONFIG = {
  // Configuración de logging
  LOGGING: {
    // Log todos los errores en desarrollo
    LOG_ALL_IN_DEV: process.env.NODE_ENV === 'development',
    // Log solo errores no operacionales en producción
    LOG_NON_OPERATIONAL_ONLY: process.env.NODE_ENV === 'production',
    // Incluir stack trace en logs
    INCLUDE_STACK_TRACE: process.env.NODE_ENV === 'development',
  },
  
  // Configuración de respuestas
  RESPONSES: {
    // Incluir detalles técnicos en respuestas de error
    INCLUDE_TECHNICAL_DETAILS: process.env.NODE_ENV === 'development',
    // Incluir timestamp en respuestas
    INCLUDE_TIMESTAMP: true,
    // Incluir path y método en respuestas
    INCLUDE_REQUEST_INFO: true,
  },
  
  // Códigos de estado HTTP personalizados
  STATUS_CODES: {
    VALIDATION_ERROR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  
  // Mensajes de error personalizados
  MESSAGES: {
    DEFAULT: 'An error occurred',
    VALIDATION: 'Validation error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    CONFLICT: 'Conflict detected',
    INTERNAL_SERVER: 'Internal server error',
    DATABASE: 'Database operation failed',
  },
  // Configuración de rate limiting para errores
  RATE_LIMITING: {
    // Máximo número de errores por IP por minuto
    MAX_ERRORS_PER_MINUTE: 100,
    // Tiempo de bloqueo en minutos después de exceder el límite
    BLOCK_TIME_MINUTES: 5,
  }
}; 