import { AppError, NotFoundError, ValidationError, ConflictError, BadRequestError } from './AppError.js';

/**
 * Función helper para lanzar errores de forma consistente
 */
export const throwError = {
  notFound: (resource: string) => {
    throw new NotFoundError(resource);
  },

  validation: (message: string) => {
    throw new ValidationError(message);
  },

  conflict: (message: string) => {
    throw new ConflictError(message);
  },

  badRequest: (message: string) => {
    throw new BadRequestError(message);
  },

  custom: (message: string, statusCode: number) => {
    throw new AppError(message, statusCode);
  },

  internalServerError: (message: string) => {
    throw new AppError(message, 500);
  }
};

/**
 * Función para manejar errores de base de datos comunes
 */
export const handleDatabaseError = (error: any): never => {
  // Errores de MikroORM comunes
  if (error.code === 'ER_DUP_ENTRY') {
    throw new ConflictError('Duplicate entry found');
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    throw new BadRequestError('Referenced record does not exist');
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    throw new ConflictError('Cannot delete: record is referenced by other records');
  }

  // Si no es un error conocido, lanzar error interno
  throw new AppError('Database operation failed', 500, false);
};

/**
 * Función para validar que un recurso existe
 */
export const assertResourceExists = <T>(resource: T | null | undefined, resourceName: string): T => {
  if (!resource) {
    throw new NotFoundError(resourceName);
  }
  return resource;
};

/**
 * Función para validar condiciones de negocio
 */
export const assertBusinessRule = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new BadRequestError(message);
  }
}; 