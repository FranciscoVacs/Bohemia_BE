# 📚 Documentación Completa de la API - Bohemia Backend

## 🌟 Información General

**Base URL:** `http://localhost:3000/api`
**Versión:** 2.2
**Autenticación:** JWT Bearer Token
**Última actualización:** Enero 2026

### 🔐 Tipos de Permisos
- **🔓 Público:** No requiere autenticación
- **🔒 Autenticado:** Requiere token JWT válido
- **👑 Admin:** Requiere token JWT válido + permisos de administrador
- **👤 Propietario:** Solo el propietario del recurso o admin

### 📦 Estructura de Respuesta Estándar

Todas las respuestas de la API siguen esta estructura:

```json
{
  "message": "Descripción de la operación",
  "data": { } // objeto o array con los datos
}
```

**Ejemplos de respuestas:**

```json
// GET /api/event (lista)
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "eventName": "Fiesta Bohemia",
      "beginDatetime": "2026-02-14T20:00:00.000Z",
      ...
    }
  ]
}

// GET /api/event/:id (único)
{
  "message": "Item found",
  "data": {
    "id": 1,
    "eventName": "Fiesta Bohemia",
    ...
  }
}

// POST (crear)
{
  "message": "Item created",
  "data": { ... }
}

// PATCH (actualizar)
{
  "message": "Item updated",
  "data": { ... }
}

// DELETE (eliminar)
{
  "message": "Item deleted"
}
```

### 🚀 Cambios Principales v2.2
- **📸 Renombrado `/api/event-images` → `/api/event-photos`**
- **🎨 Nuevo estado de galería (`galleryStatus: PUBLISHED | ARCHIVED`)**
- **🔓 Endpoints públicos para galerías: `/galleries` y `/gallery/:eventId`**
- **📐 Validación de dimensiones para cover photo: 1000x800 px exactos**
- **📦 Upload de hasta 50 fotos por subida**

---

## 🔐 Autenticación

### Registrar Usuario
**POST** `/user/register`
- **Permisos:** 🔓 Público
- **Propósito:** Crear una nueva cuenta de usuario
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "userName": "string",
  "userSurname": "string",
  "email": "string",
  "password": "string (mín 8 caracteres, mayúscula, minúscula y número)",
  "birthDate": "YYYY-MM-DD HH:MM:SS"
}
```

**Response:**
```json
{
  "message": "User created",
  "data": {
    "id": 1,
    "userName": "Juan",
    "userSurname": "Pérez",
    "email": "juan@email.com",
    "birthDate": "1990-05-15 00:00:00",
    "isAdmin": false
  }
}
```

### Login
**POST** `/user/login`
- **Permisos:** 🔓 Público
- **Propósito:** Autenticar usuario y obtener token JWT
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "juan@email.com",
    "isAdmin": false
  }
}
```
- **Headers de Respuesta:** `token: Bearer <jwt_token>`

---

## 👤 Gestión del Usuario Actual (Endpoints /me)

### Obtener Mi Información
**GET** `/user/me`
- **Permisos:** 🔒 Autenticado
- **Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Item found",
  "data": {
    "id": 1,
    "userName": "Juan",
    "userSurname": "Pérez",
    "email": "juan@email.com",
    "birthDate": "1990-05-15T00:00:00.000Z",
    "isAdmin": false
  }
}
```

### Obtener Mis Compras
**GET** `/user/me/purchases`
- **Permisos:** 🔒 Autenticado

**Response:**
```json
{
  "message": "Purchases found",
  "data": [
    {
      "id": 1,
      "purchaseDate": "2026-01-15T10:30:00.000Z",
      "ticketQuantity": 2,
      "totalPrice": 5000
    }
  ]
}
```

### Ver Tickets de una Compra Mía
**GET** `/user/me/purchases/:id/tickets`
- **Permisos:** 🔒 Autenticado
- **Parámetros:** `id` (ID de compra)

### Actualizar Mi Información
**PATCH** `/user/me`
- **Permisos:** 🔒 Autenticado
- **Content-Type:** `application/json`

### Eliminar Mi Cuenta
**DELETE** `/user/me`
- **Permisos:** 🔒 Autenticado

---

## 👥 Gestión de Usuarios (Solo Admin)

### Listar Todos los Usuarios
**GET** `/user`
- **Permisos:** 🔒 Autenticado + 👑 Admin

**Response:**
```json
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "userName": "Juan",
      "userSurname": "Pérez",
      "email": "juan@email.com",
      "birthDate": "1990-05-15T00:00:00.000Z",
      "isAdmin": false
    }
  ]
}
```

### Crear Usuario Manualmente
**POST** `/user`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `application/json`

### Obtener Usuario por ID
**GET** `/user/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Actualizar Usuario por ID
**PATCH** `/user/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)
- **Content-Type:** `application/json`

### Eliminar Usuario por ID
**DELETE** `/user/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

---

## 🎉 Gestión de Eventos

### Obtener Próximo Evento
**GET** `/event/future`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener el próximo evento publicado que no ha terminado

**Filtros aplicados:**
- `isPublished` debe ser `true`
- `finishDatetime` debe ser mayor a la fecha actual (incluye eventos en curso)

**Response (con evento):**
```json
{
  "message": "Próximo evento obtenido exitosamente",
  "data": {
    "eventName": "Fiesta Bohemia",
    "beginDatetime": "2026-02-14T20:00:00.000Z",
    "finishDatetime": "2026-02-15T04:00:00.000Z",
    "eventDescription": "La mejor fiesta del año",
    "minAge": 18,
    "coverPhoto": "http://localhost:3000/public/uploads/1234_foto.jpg",
    "location": {
      "locationName": "Club Bohemia",
      "address": "Av. Principal 123",
      "city": { "cityName": "Buenos Aires" }
    },
    "dj": { "djApodo": "Beats" }
  }
}
```

**Response (sin eventos):**
```json
{
  "message": "No hay eventos proximos",
  "data": null
}
```

### Listar Todos los Eventos (Admin)
**GET** `/event/admin`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Obtener todos los eventos con información básica para el panel de administración

**Response:**
```json
{
  "message": "Eventos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "eventName": "Fiesta Bohemia",
      "beginDatetime": "2026-02-14T20:00:00.000Z",
      "finishDatetime": "2026-02-15T04:00:00.000Z",
      "eventDescription": "La mejor fiesta del año",
      "minAge": 18,
      "coverPhoto": "http://localhost:3000/public/uploads/1234_foto.jpg",
      "location": {
        "locationName": "Club Bohemia",
        "address": "Av. Principal 123",
        "city": { "cityName": "Buenos Aires" }
      },
      "dj": { "djApodo": "Beats" },
      "isGalleryPublished": false,
      "isPublished": true
    }
  ]
}
```

### Obtener Evento por ID (Admin)
**GET** `/event/admin/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)
- **Propósito:** Obtener detalle completo de un evento para administración

**Response:**
```json
{
  "message": "Evento obtenido exitosamente",
  "data": {
    "id": 1,
    "eventName": "Fiesta Bohemia",
    "beginDatetime": "2026-02-14T20:00:00.000Z",
    "finishDatetime": "2026-02-15T04:00:00.000Z",
    "eventDescription": "La mejor fiesta del año",
    "minAge": 18,
    "coverPhoto": "http://localhost:3000/public/uploads/1234_foto.jpg",
    "location": {
      "locationName": "Club Bohemia",
      "address": "Av. Principal 123",
      "city": { "cityName": "Buenos Aires" }
    },
    "dj": { "djApodo": "Beats" },
    "isGalleryPublished": false,
    "isPublished": true
  }
}
```

### Obtener Estadísticas de Evento (Admin)
**GET** `/event/:eventId/stats`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `eventId` (número)
- **Query Params:** `limit` (opcional, número de transacciones recientes a mostrar, default: 10)
- **Propósito:** Obtener métricas y estadísticas de ventas de un evento, incluyendo desglose por tipo de ticket y transacciones recientes.

**Response:**
```json
{
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "eventId": 1,
    "eventName": "Fiesta Bohemia",
    "eventStatus": "upcoming",
    "saleStatus": "active",
    "lastUpdated": "2026-02-14T10:00:00.000Z",
    "summary": {
      "totalTicketsSold": 150,
      "totalCapacity": 500,
      "percentageSold": 30,
      "totalRevenue": 375000,
      "averageTicketPrice": 2500
    },
    "byTicketType": [
      {
        "id": 1,
        "name": "General",
        "sold": 100,
        "capacity": 400,
        "percentageSold": 25,
        "revenue": 200000,
        "price": 2000
      }
    ],
    "recentTransactions": [
      {
        "id": 42,
        "userName": "Juan Pérez",
        "userInitials": "JP",
        "ticketTypeName": "General",
        "quantity": 2,
        "totalPrice": 4000,
        "createdAt": "2026-02-14T09:30:00.000Z"
      }
    ],
    "lastSale": {
      "userName": "Juan Pérez",
      "ticketTypeName": "General",
      "timeAgo": "Hace 30m",
      "createdAt": "2026-02-14T09:30:00.000Z"
    }
  }
}
```

### Obtener Evento por ID (Público)
**GET** `/event/:id`
- **Permisos:** 🔓 Público
- **Parámetros:** `id` (número)
- **Nota:** Solo devuelve eventos con `isPublished: true`

**Response:**
```json
{
  "message": "Evento obtenido exitosamente",
  "data": {
    "id": 1,
    "eventName": "Fiesta Bohemia",
    "beginDatetime": "2026-02-14T20:00:00.000Z",
    "finishDatetime": "2026-02-15T04:00:00.000Z",
    "eventDescription": "La mejor fiesta del año",
    "minAge": 18,
    "coverPhoto": "http://localhost:3000/public/uploads/1234_foto.jpg",
    "location": {
      "locationName": "Club Bohemia",
      "address": "Av. Principal 123",
      "city": { "cityName": "Buenos Aires" }
    },
    "dj": { "djApodo": "Beats" },
    "ticketTypes": [
      {
        "id": 1,
        "ticketTypeName": "General",
        "beginDatetime": "2026-01-01T00:00:00.000Z",
        "finishDatetime": "2026-02-14T18:00:00.000Z",
        "price": 2500,
        "availableTickets": 85,
        "isSaleActive": true
      }
    ]
  }
}
```

### Obtener Tipos de Tickets de un Evento
**GET** `/event/:id/ticketTypes`
- **Permisos:** 🔓 Público
- **Parámetros:** `id` (número)

**Response:**
```json
{
  "message": "Tipos de tickets obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "ticketTypeName": "General",
      "beginDatetime": "2026-01-01T00:00:00.000Z",
      "finishDatetime": "2026-02-14T18:00:00.000Z",
      "price": 2500,
      "availableTickets": 85,
      "isSaleActive": true
    }
  ]
}
```

### Crear Evento
**POST** `/event/crear`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `multipart/form-data`
- **Archivo:** `cover_photo` (imagen jpg/jpeg/png, máx 5MB) - **REQUERIDO**

**Request Body (form-data):**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `eventName` | string | Nombre del evento (máx 100 caracteres) |
| `beginDatetime` | string | Fecha inicio `YYYY-MM-DD HH:MM:SS` (debe ser futura) |
| `finishDatetime` | string | Fecha fin `YYYY-MM-DD HH:MM:SS` (debe ser posterior a beginDatetime) |
| `eventDescription` | string | Descripción del evento (máx 100 caracteres) |
| `minAge` | number | Edad mínima requerida |
| `location` | number | ID de la ubicación |
| `dj` | number | ID del DJ |
| `coverPhoto` | file | Imagen de portada (jpg/jpeg/png) - **Debe ser exactamente 1000x800 px** |

**Response:**
```json
{
  "message": "Evento creado exitosamente",
  "data": {
    "id": 1,
    "eventName": "Fiesta Bohemia",
    "beginDatetime": "2026-02-14T20:00:00.000Z",
    "finishDatetime": "2026-02-15T04:00:00.000Z",
    "eventDescription": "La mejor fiesta del año",
    "minAge": 18,
    "coverPhoto": "http://localhost:3000/public/uploads/1705312345_foto.jpg",
    "ticketsOnSale": 0,
    "location": 1,
    "dj": 1
  }
}
```

### Actualizar Evento
**PATCH** `/event/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `multipart/form-data`
- **Archivo:** `cover_photo` (opcional - nueva imagen de portada)
- **Parámetros:** `id` (número)

### Eliminar Evento
**DELETE** `/event/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Actualizar Estado de Galería
**PATCH** `/event/:id/gallery-status`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)
- **Propósito:** Cambiar si la galería de fotos del evento está publicada

**Request Body:**
```json
{
  "isGalleryPublished": true
}
```

**Response:**
```json
{
  "message": "Estado de galería actualizado",
  "data": {
    "id": 1,
    "isGalleryPublished": true
  }
}
```

> **Nota:** Por defecto, los eventos nuevos tienen `isGalleryPublished: false`. Solo las galerías publicadas son visibles para usuarios públicos.

### Publicar Evento
**PATCH** `/event/:id/publish`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)
- **Propósito:** Publicar un evento para que sea visible públicamente
- **Requisito:** El evento debe tener al menos un tipo de ticket creado

**Response (éxito):**
```json
{
  "message": "Evento publicado exitosamente",
  "data": {
    "id": 1,
    "isPublished": true
  }
}
```

**Errores posibles:**
- `400 Bad Request`: "No se puede publicar un evento sin tipos de tickets. Agregue al menos uno."
- `400 Bad Request`: "El evento ya está publicado."

---

## 🎫 Gestión de Tipos de Entrada

### Listar Tipos de Entrada de un Evento
**GET** `/event/:eventId/ticketType`
- **Permisos:** 🔓 Público
- **Parámetros:** `eventId` (ID del evento)

**Response:**
```json
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "ticketTypeName": "General",
      "price": 2500,
      "maxQuantity": 100,
      "availableTickets": 85,
      "sortOrder": 1,
      "status": "active",
      "activatedAt": "2026-01-01T00:00:00.000Z",
      "event": 1
    },
    {
      "id": 2,
      "ticketTypeName": "VIP",
      "price": 5000,
      "maxQuantity": 20,
      "availableTickets": 15,
      "sortOrder": 2,
      "status": "pending",
      "event": 1
    }
  ]
}
```

### Obtener Tipo de Entrada por ID
**GET** `/event/:eventId/ticketType/:id`
- **Permisos:** 🔓 Público
- **Parámetros:** `eventId`, `id`

### Crear Tipo de Entrada
**POST** `/event/:eventId/ticketType`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "ticketTypeName": "string (máx 100 caracteres)",
  "price": "number (entero positivo)",
  "maxQuantity": "number (entero positivo)",
  "sortOrder": "number",
  "event": "number (ID del evento)"
}
```

**Response:**
```json
{
  "message": "Tipo de ticket creado exitosamente",
  "data": {
    "id": 1,
    "ticketTypeName": "General",
    "price": 2500,
    "maxQuantity": 100,
    "availableTickets": 100,
    "sortOrder": 1,
    "status": "active",
    "activatedAt": "2026-01-01T00:00:00.000Z",
    "event": 1
  },
  "capacityInfo": {
    "newTotalCapacity": 100,
    "locationMaxCapacity": 500,
    "remainingCapacity": 400
  }
}
```

### Actualizar Tipo de Entrada
**PATCH** `/event/:eventId/ticketType/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `eventId`, `id`
- **Nota:** No se puede actualizar el `status` ni `activatedAt`/`closedAt` por este medio. Valida que la nueva suma de `maxQuantity` no supere la capacidad máxima de la ubicación.

### Cerrar Tipo de Entrada
**PATCH** `/event/:eventId/ticketType/:id/close`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `eventId`, `id`
- **Propósito:** Cambia el estado del ticket a `closed` y establece `closedAt`.

### Eliminar Tipo de Entrada
**DELETE** `/event/:eventId/ticketType/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `eventId`, `id`

---

## 🛒 Gestión de Compras

### Crear Preferencia de MercadoPago
**POST** `/purchase/create_preference`
- **Permisos:** 🔒 Autenticado
- **Content-Type:** `application/json`
- **Propósito:** Genera la preferencia de pago en MercadoPago para iniciar la compra.

**Request Body:**
```json
{
  "ticketTypeId": "number",
  "ticketQuantity": "number"
}
```

**Response:**
```json
{
  "message": "Preference created successfully",
  "data": {
    "id": "123456789-abcdefg-...",
    "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
  }
}
```

### Webhook de MercadoPago
**POST** `/purchase/payments/webhook`
- **Permisos:** 🔓 Público
- **Propósito:** Recibir notificaciones del sistema de MercadoPago sobre actualizaciones en los estados de pago.

### Verificar Compra (Frontend Callback)
**GET** `/purchase/verify/:paymentId`
- **Permisos:** 🔒 Autenticado
- **Parámetros:** `paymentId` (ID del pago emitido por MercadoPago)
- **Propósito:** Validar el estado del pago con la base de datos tras la redirección desde MercadoPago.

### Realizar Compra (Directa)
**POST** `/purchase`
- **Permisos:** 🔒 Autenticado
- **Content-Type:** `application/json`
- **⚠️ Estado:** Validación de esquema deshabilitada temporalmente

**Request Body:**
```json
{
  "ticketTypeId": "number",
  "ticketQuantity": "number",
  "userId": "number"
}
```

**Response:**
```json
{
  "message": "Purchase created successfully",
  "data": {
    "purchaseId": 1,
    "ticketNumbers": 2,
    "totalPrice": 5500,
    "paymentStatus": "approved"
  }
}
```

> **Nota:** La compra genera los tickets inmediatamente con estado `approved`.

### Descargar PDF de Ticket
**GET** `/purchase/:purchaseId/ticket/:ticketId`
- **Permisos:** 🔒 Autenticado + 👤 Propietario
- **Parámetros:** `purchaseId`, `ticketId`
- **Respuesta:** Archivo PDF
- **Headers de Respuesta:** 
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename=ticket.pdf`

---

## 🛒 Gestión de Compras (Solo Admin)

### Listar Todas las Compras
**GET** `/purchase`
- **Permisos:** 🔒 Autenticado + 👑 Admin

**Response:**
```json
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "purchaseDate": "2026-01-15T10:30:00.000Z",
      "ticketQuantity": 2,
      "totalPrice": 5000,
      "ticketType": { ... },
      "user": { ... }
    }
  ]
}
```

### Obtener Compra por ID
**GET** `/purchase/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (ID de compra)

### Actualizar Compra
**PATCH** `/purchase/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Eliminar Compra
**DELETE** `/purchase/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

---

## 🎫 Gestión de Tickets (Solo Admin)

### Listar Todos los Tickets
**GET** `/ticket`
- **Permisos:** 🔒 Autenticado + 👑 Admin

### Obtener Ticket por ID
**GET** `/ticket/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Crear Ticket Manualmente
**POST** `/ticket`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `application/json`

### Actualizar Ticket
**PATCH** `/ticket/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Eliminar Ticket
**DELETE** `/ticket/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

**📝 Nota:** Los usuarios regulares acceden a sus tickets a través de `/user/me/purchases/:id/tickets`

---

## 🏢 Gestión de Ubicaciones

### Listar Ubicaciones
**GET** `/location`
- **Permisos:** 🔓 Público

**Response:**
```json
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "locationName": "Club Bohemia",
      "address": "Av. Corrientes 1234",
      "maxCapacity": 500,
      "latitude": -34.6037,
      "longitude": -58.3816,
      "city": {
        "id": 1,
        "cityName": "Buenos Aires",
        "province": "Buenos Aires",
        "zipCode": 1000
      }
    }
  ]
}
```

### Obtener Ubicación por ID
**GET** `/location/:id`
- **Permisos:** 🔓 Público
- **Parámetros:** `id` (número)

### Crear Ubicación
**POST** `/location`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "locationName": "string (máx 100 caracteres)",
  "address": "string (máx 100 caracteres, único)",
  "maxCapacity": "number (entero positivo)",
  "latitude": "number (opcional)",
  "longitude": "number (opcional)",
  "city": "number (ID de ciudad)"
}
```

**Response:**
```json
{
  "message": "Item created",
  "data": {
    "id": 1,
    "locationName": "Club Bohemia",
    "address": "Av. Corrientes 1234",
    "maxCapacity": 500,
    "city": 1
  }
}
```

### Actualizar Ubicación
**PATCH** `/location/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Eliminar Ubicación
**DELETE** `/location/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

---

## 🏙️ Gestión de Ciudades

### Listar Ciudades
**GET** `/city`
- **Permisos:** 🔓 Público

**Response:**
```json
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "cityName": "Buenos Aires",
      "province": "Buenos Aires",
      "zipCode": 1000
    },
    {
      "id": 2,
      "cityName": "Córdoba",
      "province": "Córdoba",
      "zipCode": 5000
    }
  ]
}
```

### Obtener Ciudad por ID
**GET** `/city/:id`
- **Permisos:** 🔓 Público
- **Parámetros:** `id` (número)

### Crear Ciudad
**POST** `/city`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "cityName": "string (máx 100 caracteres, único)",
  "province": "string (máx 100 caracteres)",
  "zipCode": "number (entero positivo)"
}
```

**Response:**
```json
{
  "message": "Item created",
  "data": {
    "id": 1,
    "cityName": "Buenos Aires",
    "province": "Buenos Aires",
    "zipCode": 1000
  }
}
```

### Actualizar Ciudad
**PATCH** `/city/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Eliminar Ciudad
**DELETE** `/city/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

---

## 🎧 Gestión de DJs

### Listar DJs
**GET** `/dj`
- **Permisos:** 🔓 Público

**Response:**
```json
{
  "message": "Find all items",
  "data": [
    {
      "id": 1,
      "djName": "Carlos",
      "djSurname": "González",
      "djApodo": "DJ Beats"
    }
  ]
}
```

### Obtener DJ por ID
**GET** `/dj/:id`
- **Permisos:** 🔓 Público
- **Parámetros:** `id` (número)

### Crear DJ
**POST** `/dj`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Content-Type:** `application/json`

**Request Body:**
```json
{
  "djName": "string (máx 100 caracteres)",
  "djSurname": "string (máx 100 caracteres)",
  "djApodo": "string"
}
```

**Response:**
```json
{
  "message": "Item created",
  "data": {
    "id": 1,
    "djName": "Carlos",
    "djSurname": "González",
    "djApodo": "DJ Beats"
  }
}
```

### Actualizar DJ
**PATCH** `/dj/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

### Eliminar DJ
**DELETE** `/dj/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Parámetros:** `id` (número)

---

## 📸 Event Photos (Fotos de Eventos)
**Base URL:** `/api/event-photos`

### Listar Eventos con Galerías Publicadas
**GET** `/event-photos/galleries`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista de eventos que tienen galerías publicadas

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "eventName": "Fiesta Bohemia",
      "beginDatetime": "2026-02-14T20:00:00.000Z",
      "finishDatetime": "2026-02-15T04:00:00.000Z",
      "coverPhoto": "http://localhost:3000/public/uploads/foto.jpg",
      "location": { "locationName": "Club Bohemia", "address": "..." },
      "dj": { "djApodo": "DJ Beats" }
    }
  ]
}
```

### Obtener Fotos de un Evento (Autenticado)
**GET** `/event-photos/gallery/:eventId`
- **Permisos:** 🔓 Autenticado (solo galerías PUBLISHED)
- **Parámetros:** `eventId` (number)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "cloudinaryUrl": "https://res.cloudinary.com/...",
      "publicId": "events/evento-name/photos-123456789",
      "originalName": "foto1.jpg",
      "event": 1
    }
  ]
}
```

### Subir Fotos a Evento
**POST** `/event-photos/upload/:eventId`
- **Permisos:** 👑 Admin
- **Content-Type:** `multipart/form-data`
- **Body:** `photos` (files[]) - Hasta 50 fotos (máx. 15MB cada una)
- **Tipos permitidos:** jpg, jpeg, png, webp
- **Almacenamiento:** Cloudinary en carpeta `events/{eventName}/`

**Response:**
```json
{
  "success": true,
  "message": "5 fotos subidas exitosamente",
  "data": [...]
}
```

### Listar Todas las Fotos
**GET** `/event-photos/`
- **Permisos:** 👑 Admin

### Actualizar Foto
**PUT** `/event-photos/:id`
- **Permisos:** 👑 Admin

### Eliminar Foto Específica
**DELETE** `/event-photos/:id`
- **Permisos:** 👑 Admin

### Eliminar Todas las Fotos de un Evento
**DELETE** `/event-photos/event/:eventId`
- **Permisos:** 👑 Admin

**Response:**
```json
{
  "success": true,
  "message": "15 fotos eliminadas exitosamente"
}
```

---

## 🔄 Flujos de Usuario Típicos

### 📱 Usuario Regular

1. **Registro/Login**
   ```
   POST /user/register → POST /user/login
   ```

2. **Ver eventos y comprar**
   ```
   GET /event/future → GET /event/:eventId/ticketType → POST /purchase
   ```

3. **Gestionar mi cuenta**
   ```
   GET /user/me → PATCH /user/me
   ```

4. **Ver mis compras**
   ```
   GET /user/me/purchases → GET /user/me/purchases/:id/tickets
   ```

5. **Descargar ticket**
   ```
   GET /purchase/:purchaseId/ticket/:ticketId
   ```

### 👑 Administrador

1. **Gestión de contenido**
   ```
   POST /city → POST /location → POST /dj → POST /event → POST /event/:eventId/ticketType
   ```

2. **Gestión de usuarios**
   ```
   GET /user → GET /user/:id → PATCH /user/:id
   ```

3. **Gestión de compras**
   ```
   GET /purchase → GET /purchase/:id
   ```

---

## 🚨 Manejo de Errores

### Estructura de Respuesta de Error

Todas las respuestas de error siguen esta estructura:

```json
{
  "message": "Descripción del error",
  "statusCode": 400,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

### Códigos de Estado HTTP

| Código | Tipo | Descripción |
|--------|------|-------------|
| **400** | Bad Request | Datos de entrada inválidos o malformados |
| **401** | Unauthorized | Token JWT faltante, inválido o expirado |
| **403** | Forbidden | Sin permisos suficientes (ej: no es admin) |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto de datos (ej: email duplicado) |
| **500** | Internal Server Error | Error interno del servidor |

---

### Ejemplos de Errores por Tipo

#### 🔴 Error de Validación (Zod) - 400
Cuando los datos enviados no cumplen con el schema de validación:

```json
{
  "message": "Validation error",
  "statusCode": 400,
  "details": [
    {
      "field": "body.eventName",
      "message": "El nombre del evento no puede exceder 100 caracteres"
    },
    {
      "field": "body.beginDatetime",
      "message": "La fecha y hora de comienzo debe ser futura"
    }
  ],
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

#### 🔴 Error de Autenticación - 401
Cuando no se proporciona token o es inválido:

```json
{
  "message": "Required token",
  "statusCode": 401,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

```json
{
  "message": "Unauthorized",
  "statusCode": 401,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

#### 🔴 Error de Permisos - 403
Cuando el usuario no tiene permisos de admin:

```json
{
  "message": "Access denied: Admin only",
  "statusCode": 403,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

#### 🔴 Error de Recurso No Encontrado - 404
Cuando se busca un recurso que no existe:

```json
{
  "message": "Event with id 999 not found",
  "statusCode": 404,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event/999",
  "method": "GET"
}
```

#### 🔴 Error de Conflicto - 409
Cuando hay datos duplicados (ej: email ya registrado):

```json
{
  "message": "Duplicate entry found",
  "statusCode": 409,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/user/register",
  "method": "POST"
}
```

#### 🔴 Error de Archivo - 400
Cuando hay problemas con la subida de archivos:

```json
{
  "message": "Please upload a file, jpg, jpeg or png",
  "statusCode": 400,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

```json
{
  "message": "Max file size 5MB",
  "statusCode": 400,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

#### 🔴 Error de Base de Datos - 400/409
Cuando hay errores relacionados con la base de datos:

```json
{
  "message": "Referenced record does not exist",
  "statusCode": 400,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

```json
{
  "message": "Cannot delete: record is referenced by other records",
  "statusCode": 409,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/location/1",
  "method": "DELETE"
}
```

#### 🔴 Error Interno del Servidor - 500
Cuando ocurre un error inesperado:

```json
{
  "message": "An error occurred",
  "statusCode": 500,
  "timestamp": "2026-01-15T10:30:00.000Z",
  "path": "/api/event",
  "method": "POST"
}
```

---

### Tipos de Errores Específicos

| Clase de Error | Código | Uso |
|----------------|--------|-----|
| `ValidationError` | 400 | Datos de entrada inválidos |
| `BadRequestError` | 400 | Solicitud mal formada |
| `UnauthorizedError` | 401 | Sin autenticación |
| `ForbiddenError` | 403 | Sin permisos |
| `NotFoundError` | 404 | Recurso no existe |
| `ConflictError` | 409 | Datos duplicados |
| `InternalServerError` | 500 | Error del servidor |

---

## 📋 Notas de Seguridad

### ✅ Implementado
- **JWT Authentication** en todas las rutas protegidas
- **Verificación de propiedad** en recursos de usuario
- **Separación admin/usuario** en endpoints
- **Validación de esquemas** con Zod
- **Verificación de propietario** para descargas de PDF

### 🔐 Headers Requeridos

**Para rutas autenticadas (JSON):**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Para rutas con archivos:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

---

## 🔧 Información Técnica

### Autenticación JWT
- **Header:** `Authorization: Bearer <token>`
- **Expiración:** 1 hora
- **Payload:** `{id, email, isAdmin}`

### Subida de Archivos (Eventos)
- **Campo:** `cover_photo`
- **Formato:** `multipart/form-data`
- **Almacenamiento:** `/public/uploads/`
- **Tipos permitidos:** jpg, jpeg, png
- **Tamaño máximo:** 5MB

### Generación de PDFs
- **Biblioteca:** PDFKit + QRCode
- **Incluye:** QR único, datos del evento, ticket info
- **Seguridad:** Solo propietario o admin

---

## 📝 Endpoints sin validación temporal
- `POST /purchase` (schema comentado)
- `GET /purchase/:purchaseId/ticket/:ticketId` (schema comentado)

---

## 🚧 Funcionalidades Pendientes

### Mejoras Sugeridas
- Implementar rate limiting
- Agregar logs de auditoría
- Notificaciones por email automáticas
- Sistema de roles más granular

---

**🎯 Documentación actualizada - API v2.2**
**📅 Última actualización: Enero 2026**
