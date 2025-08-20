# Sistema de Manejo de Errores Centralizado - BohemiaPage

## 📖 Descripción General

Este sistema proporciona un manejo centralizado y consistente de errores en toda la aplicación BohemiaPage. Permite personalizar códigos de estado HTTP, mensajes de error y logging detallado, eliminando la necesidad de manejar errores de forma manual en cada controlador.

## 🎯 Características Principales

- ✅ **Errores personalizados** con códigos de estado HTTP específicos
- ✅ **Logging centralizado** con diferentes niveles según el entorno
- ✅ **Manejo automático** de errores de base de datos y validación
- ✅ **Respuestas consistentes** con formato estandarizado
- ✅ **Configuración flexible** para diferentes entornos
- ✅ **Middleware asíncrono** para captura automática de errores
- ✅ **Validaciones de negocio** integradas y reutilizables

## 🏗️ Estructura de Archivos

```
src/shared/errors/
├── AppError.ts          # Clases base de errores personalizados
├── ErrorUtils.ts        # Utilidades y helpers para validaciones
├── ErrorConfig.ts       # Configuración del sistema de errores
└── index.ts            # Exportaciones centralizadas

src/middlewares/
├── errorHandler.ts      # Manejador global de errores
├── errorLogger.ts       # Sistema de logging estructurado
└── asyncHandler.ts      # Wrapper para operaciones asíncronas
```

## 🔄 Cómo Funciona el Sistema

### **Flujo de Manejo de Errores:**

```
1. Request llega al servidor
2. Controlador ejecuta lógica de negocio
3. Si hay error → se lanza con throw (AppError o Error)
4. asyncHandler captura automáticamente el error
5. Error se propaga al errorHandler global
6. errorHandler procesa y formatea la respuesta
7. errorLogger registra el error con información estructurada
8. Cliente recibe respuesta de error consistente
```

### **Ejemplo Visual del Flujo:**

```typescript
// 1. Usuario hace request: GET /api/user/999
// 2. Controlador ejecuta:
const user = await this.model.getById(999);
assertResourceExists(user, `User with id 999`);

// 3. Si user es null, assertResourceExists lanza:
throw new NotFoundError(`User with id 999`);

// 4. asyncHandler captura automáticamente:
Promise.resolve(fn(req, res, next)).catch(next);

// 5. Error va al errorHandler global
// 6. errorHandler decide qué hacer:
if (error instanceof AppError) {
  statusCode = error.statusCode;  // 404
  message = error.message;        // "User with id 999 not found"
}

// 7. errorLogger registra:
errorLogger.logError(error, req, 404, true);

// 8. Cliente recibe:
{
  "message": "User with id 999 not found",
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/user/999",
  "method": "GET"
}
```

## 🚀 Uso Básico en el Desarrollo

### **1. Lanzar Errores Personalizados**

```typescript
import { throwError, NotFoundError, BadRequestError } from '../shared/errors/AppError.js';

// Usar helpers predefinidos (RECOMENDADO)
throwError.notFound('User');
throwError.validation('Email is required');
throwError.conflict('User already exists');
throwError.badRequest('Invalid input data');
throwError.unauthorized('Invalid credentials');

// O usar clases directamente
throw new NotFoundError('Event');
throw new BadRequestError('Invalid input data');
throw new UnauthorizedError('Token expired');
```

### **2. Validaciones de Negocio**

```typescript
import { assertResourceExists, assertBusinessRule } from '../shared/errors/ErrorUtils.js';

// Verificar que un recurso existe
const user = await userModel.getById(id);
assertResourceExists(user, `User with id ${id}`);

// Validar reglas de negocio
assertBusinessRule(
  user.age >= 18,
  'User must be at least 18 years old'
);

assertBusinessRule(
  event.capacity > 0,
  'Event capacity must be greater than 0'
);

assertBusinessRule(
  new Date(event.date) > new Date(),
  'Event date must be in the future'
);
```

### **3. Manejo de Errores de Base de Datos**

```typescript
import { handleDatabaseError } from '../shared/errors/ErrorUtils.js';

try {
  await this.em.flush();
} catch (error) {
  // Los errores de MySQL se convierten automáticamente en AppError
  handleDatabaseError(error);
}
```

### **4. Controladores con asyncHandler**

```typescript
import { asyncHandler } from '../middlewares/asyncHandler.js';

export class UserController {
  // Los errores se capturan automáticamente
  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await this.model.getById(id);
    
    // Si user es null, se lanza automáticamente NotFoundError
    assertResourceExists(user, `User with id ${id}`);
    
    res.status(200).send({ message: 'User found', data: user });
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, age } = req.body;
    
    // Validaciones de negocio
    assertBusinessRule(age >= 18, 'User must be at least 18 years old');
    assertBusinessRule(email.includes('@'), 'Invalid email format');
    
    const user = await this.model.create(req.body);
    res.status(201).send({ message: 'User created', data: user });
  });
}
```

## 📋 Tipos de Error Disponibles

| Clase | Código HTTP | Descripción | Cuándo Usar |
|-------|-------------|-------------|--------------|
| `ValidationError` | 400 | Error de validación de datos | Datos de entrada inválidos |
| `BadRequestError` | 400 | Solicitud mal formada | Parámetros incorrectos |
| `UnauthorizedError` | 401 | No autorizado | Token inválido/expirado |
| `ForbiddenError` | 403 | Acceso prohibido | Permisos insuficientes |
| `NotFoundError` | 404 | Recurso no encontrado | ID inexistente |
| `ConflictError` | 409 | Conflicto de datos | Duplicados, restricciones |
| `InternalServerError` | 500 | Error interno del servidor | Errores inesperados |

## ⚙️ Configuración del Sistema

### **Variables de Entorno**

```bash
# .env
NODE_ENV=development  # development | production
PORT=3000
```

### **Personalización de Configuración**

Edita `src/shared/errors/ErrorConfig.ts` para modificar:

```typescript
export const ERROR_CONFIG = {
  // Configuración de logging
  LOGGING: {
    LOG_ALL_IN_DEV: process.env.NODE_ENV === 'development',
    LOG_NON_OPERATIONAL_ONLY: process.env.NODE_ENV === 'production',
    INCLUDE_STACK_TRACE: process.env.NODE_ENV === 'development',
  },
  
  // Configuración de respuestas
  RESPONSES: {
    INCLUDE_TECHNICAL_DETAILS: process.env.NODE_ENV === 'development',
    INCLUDE_TIMESTAMP: true,
    INCLUDE_REQUEST_INFO: true,
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
  }
};
```

## 📤 Respuestas de Error

### **Formato Estándar (Producción)**

```json
{
  "message": "User with id 999 not found",
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/user/999",
  "method": "GET"
}
```

### **Formato Detallado (Desarrollo)**

```json
{
  "message": "User with id 999 not found",
  "statusCode": 404,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/user/999",
  "method": "GET",
  "stack": "NotFoundError: User with id 999 not found\n    at...",
  "errorType": "NotFoundError"
}
```

### **Errores de Validación (Zod)**

```json
{
  "message": "Validation error",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Age must be a positive number"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/user",
  "method": "POST"
}
```

## 🔍 Sistema de Logging

### **Niveles de Log**

- **🚨 ERROR**: Errores críticos y operacionales
- **⚠️ WARNING**: Advertencias y errores de validación
- **🔍 DEBUG**: Información de debugging (solo en desarrollo)

### **Configuración de Logging**

- **Desarrollo**: Log completo de todos los errores con stack trace
- **Producción**: Solo errores no operacionales (críticos) con información mínima

### **Ejemplo de Log Estructurado**

```json
🚨 ERROR LOG: {
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "error",
  "message": "User with id 999 not found",
  "statusCode": 404,
  "path": "/api/user/999",
  "method": "GET",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "userId": null,
  "isOperational": true,
  "errorType": "NotFoundError"
}
```

## 🛠️ Guía de Desarrollo y Mantenimiento

### **Reglas de Oro para Mantener Consistencia**

#### **1. SIEMPRE usar asyncHandler en controladores**

```typescript
// ✅ CORRECTO
export class EventController {
  createEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Lógica del controlador
  });
}

// ❌ INCORRECTO
export class EventController {
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Lógica del controlador
    } catch (error) {
      next(error);
    }
  };
}
```

#### **2. SIEMPRE usar funciones de validación del sistema**

```typescript
// ✅ CORRECTO
const user = await this.model.getById(id);
assertResourceExists(user, `User with id ${id}`);

// ❌ INCORRECTO
const user = await this.model.getById(id);
if (!user) {
  return res.status(404).json({ message: "User not found" });
}
```

#### **3. SIEMPRE lanzar errores específicos**

```typescript
// ✅ CORRECTO
if (age < 18) {
  throwError.badRequest("User must be at least 18 years old");
}

// ❌ INCORRECTO
if (age < 18) {
  throw new Error("User must be at least 18 years old");
}
```

#### **4. NUNCA manejar errores manualmente en controladores**

```typescript
// ✅ CORRECTO - Dejar que el sistema maneje el error
const result = await this.model.create(data);
res.status(201).json(result);

// ❌ INCORRECTO - Manejo manual
try {
  const result = await this.model.create(data);
  res.status(201).json(result);
} catch (error) {
  res.status(500).json({ message: "Internal error" });
}
```

### **Patrones de Validación Recomendados**

#### **Validación de Recursos**

```typescript
// Para verificar que un recurso existe
const user = await this.model.getById(id);
assertResourceExists(user, `User with id ${id}`);

// Para verificar que múltiples recursos existen
const event = await this.eventModel.getById(eventId);
const location = await this.locationModel.getById(locationId);

assertResourceExists(event, `Event with id ${eventId}`);
assertResourceExists(location, `Location with id ${locationId}`);
```

#### **Validaciones de Negocio**

```typescript
// Validar fechas
assertBusinessRule(
  new Date(event.date) > new Date(),
  'Event date must be in the future'
);

// Validar cantidades
assertBusinessRule(
  quantity > 0 && quantity <= maxQuantity,
  `Quantity must be between 1 and ${maxQuantity}`
);

// Validar permisos
assertBusinessRule(
  user.role === 'admin' || user.id === event.ownerId,
  'Insufficient permissions to modify this event'
);
```

#### **Validaciones de Entrada**

```typescript
// Validar formato de email
assertBusinessRule(
  email.includes('@') && email.includes('.'),
  'Invalid email format'
);

// Validar longitud de campos
assertBusinessRule(
  password.length >= 8,
  'Password must be at least 8 characters long'
);

// Validar rangos numéricos
assertBusinessRule(
  age >= 0 && age <= 120,
  'Age must be between 0 and 120'
);
```

## 🔄 Migración de Código Existente

### **Paso a Paso para Migrar Controladores**

#### **Paso 1: Importar dependencias**

```typescript
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { throwError, assertResourceExists, assertBusinessRule } from '../shared/errors/ErrorUtils.js';
```

#### **Paso 2: Envolver métodos con asyncHandler**

```typescript
// ANTES
getById = async (req: Request, res: Response, next: NextFunction) => {
  // código...
};

// DESPUÉS
getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // código...
});
```

#### **Paso 3: Eliminar try-catch manual**

```typescript
// ANTES
try {
  const user = await this.model.getById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
} catch (error) {
  next(error);
}

// DESPUÉS
const user = await this.model.getById(id);
assertResourceExists(user, `User with id ${id}`);
res.json(user);
```

#### **Paso 4: Reemplazar validaciones manuales**

```typescript
// ANTES
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// DESPUÉS
assertResourceExists(user, `User with id ${id}`);
```

### **Ejemplo Completo de Migración**

#### **Controlador Antes de la Migración**

```typescript
export class EventController {
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, date, locationId, capacity } = req.body;
      
      // Validar que la ubicación existe
      const location = await this.locationModel.getById(locationId);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      
      // Validar fecha futura
      if (new Date(date) <= new Date()) {
        return res.status(400).json({ message: "Event date must be in the future" });
      }
      
      // Validar capacidad
      if (capacity <= 0) {
        return res.status(400).json({ message: "Capacity must be greater than 0" });
      }
      
      const event = await this.model.create(req.body);
      res.status(201).json({ message: "Event created", data: event });
    } catch (error) {
      next(error);
    }
  };
}
```

#### **Controlador Después de la Migración**

```typescript
export class EventController {
  createEvent = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, date, locationId, capacity } = req.body;
    
    // Validar que la ubicación existe
    const location = await this.locationModel.getById(locationId);
    assertResourceExists(location, `Location with id ${locationId}`);
    
    // Validar fecha futura
    assertBusinessRule(
      new Date(date) > new Date(),
      'Event date must be in the future'
    );
    
    // Validar capacidad
    assertBusinessRule(
      capacity > 0,
      'Capacity must be greater than 0'
    );
    
    const event = await this.model.create(req.body);
    res.status(201).json({ message: "Event created", data: event });
  });
}
```

## 🧪 Testing del Sistema de Errores

### **Testing de Errores Personalizados**

```typescript
import { NotFoundError, BadRequestError } from '../shared/errors/AppError.js';

describe('Error Handling', () => {
  it('should throw NotFoundError for non-existent resource', () => {
    expect(() => {
      throw new NotFoundError('User');
    }).toThrow(NotFoundError);
    
    expect(() => {
      throw new NotFoundError('User');
    }).toThrow('User not found');
  });

  it('should have correct status code', () => {
    const error = new NotFoundError('User');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });
});
```

### **Testing de Utilidades de Error**

```typescript
import { assertResourceExists, assertBusinessRule } from '../shared/errors/ErrorUtils.js';

describe('Error Utils', () => {
  it('should throw error when resource does not exist', () => {
    expect(() => {
      assertResourceExists(null, 'User');
    }).toThrow(NotFoundError);
  });

  it('should not throw when resource exists', () => {
    const user = { id: 1, name: 'John' };
    expect(() => {
      assertResourceExists(user, 'User');
    }).not.toThrow();
  });

  it('should throw error when business rule is violated', () => {
    expect(() => {
      assertBusinessRule(false, 'Rule violated');
    }).toThrow(BadRequestError);
  });
});
```

## 🔧 Troubleshooting Común

### **Error: "Error handler not catching errors"**

**Causas:**
- `errorHandler` no está al final de la cadena de middlewares
- Controladores no usan `asyncHandler`
- Errores se lanzan con `return` en lugar de `throw`

**Solución:**
```typescript
// En app.ts, asegurar este orden:
app.use('/api/...', router);  // Rutas
app.use(errorHandler);         // Error handler AL FINAL
```

### **Error: "Validation errors not showing details"**

**Causas:**
- `schemaValidator` no usa `next(error)`
- Esquemas Zod mal configurados

**Solución:**
```typescript
// En schemaValidator.ts
} catch (error) {
  next(error);  // ← Usar next(error), no res.status().send()
}
```

### **Error: "Logs not appearing"**

**Causas:**
- `NODE_ENV` no configurado
- `errorLoggingMiddleware` en orden incorrecto
- `errorHandler` no está después de las rutas

**Solución:**
```typescript
// En app.ts, orden correcto:
app.use(errorLoggingMiddleware);  // ← ANTES de las rutas
app.use('/api/...', router);      // Rutas
app.use(errorHandler);            // ← DESPUÉS de las rutas
```

### **Error: "TypeScript compilation errors"**

**Causas:**
- Imports incorrectos de `EntityManager`
- Tipos incompatibles entre `@mikro-orm/core` y `@mikro-orm/mysql`

**Solución:**
```typescript
// Usar el tipo correcto para MySQL
import type { EntityManager } from "@mikro-orm/mysql";
```

## 📚 Mejores Prácticas para el Desarrollo

### **1. Estructura de Controladores**

```typescript
export class UserController extends BaseController<User> {
  // Usar asyncHandler para todos los métodos
  getAll = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.model.getAll();
    res.status(200).send({ message: "Users found", data: users });
  });

  getById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const user = await this.model.getById(id);
    assertResourceExists(user, `User with id ${id}`);
    res.status(200).send({ message: "User found", data: user });
  });

  create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, age } = req.body;
    
    // Validaciones de negocio
    assertBusinessRule(age >= 18, 'User must be at least 18 years old');
    assertBusinessRule(email.includes('@'), 'Invalid email format');
    
    const user = await this.model.create(req.body);
    res.status(201).send({ message: "User created", data: user });
  });
}
```

### **2. Validaciones en Modelos**

```typescript
export class EventModel extends BaseModel<Event> {
  async createEventWithValidation(data: CreateEventData): Promise<Event> {
    // Validaciones de negocio
    assertBusinessRule(
      data.capacity > 0,
      'Event capacity must be greater than 0'
    );
    
    assertBusinessRule(
      new Date(data.date) > new Date(),
      'Event date must be in the future'
    );
    
    try {
      const event = this.em.create(Event, data);
      await this.em.flush();
      return event;
    } catch (error) {
      handleDatabaseError(error);
    }
  }
}
```

### **3. Manejo de Errores en Servicios**

```typescript
export class MercadoPagoService {
  async createPayment(paymentData: PaymentData): Promise<Payment> {
    try {
      const payment = await this.mp.createPayment(paymentData);
      return payment;
    } catch (error) {
      // Convertir errores de MercadoPago a errores de la aplicación
      if (error.code === 'INVALID_AMOUNT') {
        throw new BadRequestError('Invalid payment amount');
      }
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new BadRequestError('Insufficient funds');
      }
      
      // Error no reconocido
      throw new InternalServerError('Payment service error');
    }
  }
}
```

## 🚀 Próximos Pasos y Expansión

### **Funcionalidades Futuras**

1. **Rate Limiting de Errores**: Limitar número de errores por IP
2. **Alertas Automáticas**: Notificar errores críticos por email/Slack
3. **Métricas de Errores**: Dashboard con estadísticas de errores
4. **Integración con Servicios Externos**: Sentry, LogRocket, etc.

### **Cómo Contribuir**

1. **Reportar Bugs**: Crear issues con ejemplos reproducibles
2. **Sugerir Mejoras**: Proponer nuevas funcionalidades
3. **Contribuir Código**: Pull requests con tests incluidos
4. **Documentar**: Mejorar ejemplos y casos de uso

## 📞 Soporte y Contacto

- **Documentación**: Este archivo y `docs/` folder
- **Issues**: GitHub Issues para bugs y feature requests
- **Discusiones**: GitHub Discussions para preguntas generales
- **Código**: Ejemplos en `src/` folder

---

**Recuerda**: La consistencia en el manejo de errores es clave para mantener un código limpio y profesional. Siempre usa el sistema centralizado y sigue las mejores prácticas documentadas aquí. 