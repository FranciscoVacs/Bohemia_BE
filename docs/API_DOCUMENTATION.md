# 📚 Documentación Completa de la API - Bohemia Backend

## 🌟 Información General

**Base URL:** `http://localhost:3000/api`
**Versión:** 1.0
**Autenticación:** JWT Bearer Token

### Tipos de Permisos
- **🔓 Público:** No requiere autenticación
- **🔒 Autenticado:** Requiere token JWT válido
- **👑 Admin:** Requiere token JWT válido + permisos de administrador

---

## 🔐 Autenticación

### Registro de Usuario
**POST** `/user`
- **Permisos:** 🔓 Público
- **Propósito:** Crear una nueva cuenta de usuario
- **Content-Type:** `application/json`

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

### Login
**POST** `/user/login`
- **Permisos:** 🔓 Público
- **Propósito:** Autenticar usuario y obtener token JWT
- **Content-Type:** `application/json`
- **Headers de Respuesta:** `token: Bearer <jwt_token>`

```json
{
  "email": "string",
  "password": "string"
}
```

### Registrar Usuario
**POST** `/user/register`
- **Permisos:** 🔓 Público
- **Propósito:** Alias para registro de usuario
- **Content-Type:** `application/json`

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

---

## 👥 Gestión de Usuarios

### Listar Usuarios
**GET** `/user`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Obtener lista de todos los usuarios registrados

### Obtener Usuario por ID
**GET** `/user/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener información de un usuario específico
- **Parámetros:** `id` (número)

### Obtener Tickets de Usuario
**GET** `/user/tickets/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Ver todas las entradas compradas por un usuario
- **Parámetros:** `id` (ID del usuario)

### Actualizar Usuario
**PATCH** `/user/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Modificar información de usuario
- **Parámetros:** `id` (número)
- **Content-Type:** `application/json`

### Eliminar Usuario
**DELETE** `/user/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Eliminar cuenta de usuario
- **Parámetros:** `id` (número)

---

## 🎉 Gestión de Eventos

### Listar Todos los Eventos
**GET** `/event`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista completa de eventos

### Listar Eventos Futuros
**GET** `/event/future`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener solo eventos que no han terminado (futuros y en curso)
- **Nota:** ⭐ Funcionalidad especializada

### Obtener Evento por ID
**GET** `/event/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener detalles de un evento específico
- **Parámetros:** `id` (número)

### Crear Evento
**POST** `/event`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Crear un nuevo evento
- **Content-Type:** `multipart/form-data`
- **Archivo:** Imagen de portada (opcional)

```json
{
  "event_name": "string",
  "begin_datetime": "YYYY-MM-DD HH:MM:SS",
  "finish_datetime": "YYYY-MM-DD HH:MM:SS",
  "event_description": "string",
  "min_age": "number",
  "location": "number", // ID de location
  "dj": "number" // ID de DJ
}
```

### Actualizar Evento
**PATCH** `/event/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Modificar evento existente
- **Content-Type:** `multipart/form-data`
- **Archivo:** Nueva imagen de portada (opcional)
- **Parámetros:** `id` (número)

### Eliminar Evento
**DELETE** `/event/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Eliminar evento
- **Parámetros:** `id` (número)

---

## 🎫 Gestión de Tipos de Entrada

### Listar Tipos de Entrada
**GET** `/event/:eventId/ticketType`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener tipos de entrada para un evento
- **Parámetros:** `eventId` (ID del evento)

### Obtener Tipo de Entrada por ID
**GET** `/event/:eventId/ticketType/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener detalles de un tipo de entrada específico
- **Parámetros:** `eventId`, `id`

### Crear Tipo de Entrada
**POST** `/event/:eventId/ticketType`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Crear nuevo tipo de entrada para un evento
- **Content-Type:** `application/json`

```json
{
  "ticket_type_name": "string",
  "price": "number",
  "max_quantity": "number",
  "event": "number" // ID del evento
}
```

### Actualizar Tipo de Entrada
**PATCH** `/event/:eventId/ticketType/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Modificar tipo de entrada existente
- **Parámetros:** `eventId`, `id`

### Eliminar Tipo de Entrada
**DELETE** `/event/:eventId/ticketType/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Eliminar tipo de entrada
- **Parámetros:** `eventId`, `id`

---

## 🛒 Gestión de Compras

### Listar Compras
**GET** `/purchase`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista de todas las compras

### Obtener Tickets de Compra
**GET** `/purchase/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener tickets asociados a una compra
- **Parámetros:** `id` (ID de compra)

### Descargar Ticket Individual (PDF)
**GET** `/purchase/:purchaseId/ticket/:ticketId`
- **Permisos:** 🔓 Público
- **Propósito:** Generar y descargar PDF de un ticket específico
- **Respuesta:** Archivo PDF
- **Headers de Respuesta:** `Content-Type: application/pdf`, `Content-Disposition: attachment; filename=ticket.pdf`
- **Parámetros:** `purchaseId`, `ticketId`

### Crear Compra
**POST** `/purchase`
- **Permisos:** 🔓 Público
- **Propósito:** Realizar una nueva compra de entradas
- **Content-Type:** `application/json`
- **⚠️ Estado:** Validación de esquema deshabilitada

```json
{
  "ticketTypeId": "number",
  "ticketQuantity": "number",
  "userId": "number"
}
```

### Actualizar Compra
**PATCH** `/purchase/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Modificar compra existente
- **Parámetros:** `id` (número)

### Eliminar Compra
**DELETE** `/purchase/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Cancelar/eliminar compra
- **Parámetros:** `id` (número)

---

## 🎫 Gestión de Tickets

### Listar Tickets
**GET** `/ticket`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista de todos los tickets

### Obtener Ticket por ID
**GET** `/ticket/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener detalles de un ticket específico
- **Parámetros:** `id` (número)

### Crear Ticket
**POST** `/ticket`
- **Permisos:** 🔓 Público
- **Propósito:** Crear nuevo ticket manualmente
- **Content-Type:** `application/json`

### Actualizar Ticket
**PATCH** `/ticket/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Modificar ticket existente
- **Parámetros:** `id` (número)

### Eliminar Ticket
**DELETE** `/ticket/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Eliminar ticket
- **Parámetros:** `id` (número)

---

## 🏢 Gestión de Ubicaciones

### Listar Ubicaciones
**GET** `/location`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista de todas las locaciones

### Obtener Ubicación por ID
**GET** `/location/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener detalles de una ubicación específica
- **Parámetros:** `id` (número)

### Crear Ubicación
**POST** `/location`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Crear nueva ubicación/venue
- **Content-Type:** `application/json`

```json
{
  "location_name": "string",
  "address": "string",
  "capacity": "number",
  "city": "number" // ID de ciudad
}
```

### Actualizar Ubicación
**PATCH** `/location/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Modificar ubicación existente
- **Parámetros:** `id` (número)

### Eliminar Ubicación
**DELETE** `/location/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Eliminar ubicación
- **Parámetros:** `id` (número)

---

## 🏙️ Gestión de Ciudades

### Listar Ciudades
**GET** `/city`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista de todas las ciudades

### Obtener Ciudad por ID
**GET** `/city/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener detalles de una ciudad específica
- **Parámetros:** `id` (número)

### Crear Ciudad
**POST** `/city`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Agregar nueva ciudad al sistema
- **Content-Type:** `application/json`

```json
{
  "city_name": "string",
  "state": "string",
  "country": "string"
}
```

### Actualizar Ciudad
**PATCH** `/city/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Modificar ciudad existente
- **Parámetros:** `id` (número)

### Eliminar Ciudad
**DELETE** `/city/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Eliminar ciudad
- **Parámetros:** `id` (número)

---

## 🎧 Gestión de DJs

### Listar DJs
**GET** `/dj`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener lista de todos los DJs

### Obtener DJ por ID
**GET** `/dj/:id`
- **Permisos:** 🔓 Público
- **Propósito:** Obtener detalles de un DJ específico
- **Parámetros:** `id` (número)

### Crear DJ
**POST** `/dj`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Agregar nuevo DJ al sistema
- **Content-Type:** `application/json`

```json
{
  "dj_name": "string",
  "genre": "string",
  "description": "string"
}
```

### Actualizar DJ
**PATCH** `/dj/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Modificar información de DJ
- **Parámetros:** `id` (número)

### Eliminar DJ
**DELETE** `/dj/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Eliminar DJ del sistema
- **Parámetros:** `id` (número)

---

## 🚧 Funcionalidades Incompletas/En Desarrollo

### Validación de Esquemas Deshabilitada
- **Endpoint:** `POST /purchase`
- **Issue:** La validación `CreatePurchaseSchema` está comentada
- **Estado:** 🔧 Pendiente de corrección

### Validación de Esquemas Deshabilitada
- **Endpoint:** `GET /purchase/:purchaseId/ticket/:ticketId`
- **Issue:** La validación `UpdatePurchaseSchema` está comentada
- **Estado:** 🔧 Pendiente de corrección

---

## 📋 Notas Importantes

### Autenticación JWT
- **Header requerido:** `Authorization: Bearer <token>`
- **Expiración:** 1 hora
- **Payload incluye:** `id`, `email`, `isAdmin`

### Subida de Archivos
- **Eventos:** Soportan subida de imagen de portada
- **Formato:** `multipart/form-data`
- **Campo:** Imagen en el campo de archivo del formulario

### Generación de PDFs
- Los tickets se pueden descargar como PDF individuales
- Incluyen códigos QR para validación
- Formato: `Content-Type: application/pdf`

### Estructura de Respuestas
```json
{
  "message": "string",
  "data": "object|array"
}
```

### Códigos de Estado HTTP
- **200:** Operación exitosa
- **201:** Recurso creado exitosamente
- **400:** Error en los datos enviados
- **401:** No autorizado (token inválido/faltante)
- **403:** Prohibido (sin permisos suficientes)
- **404:** Recurso no encontrado
- **500:** Error interno del servidor

---

## 🔄 Flujos de Trabajo Comunes

### 1. Crear un Evento Completo
1. `POST /dj` - Crear DJ (admin)
2. `POST /city` - Crear ciudad (admin)
3. `POST /location` - Crear ubicación (admin)
4. `POST /event` - Crear evento (admin)
5. `POST /event/:eventId/ticketType` - Crear tipos de entrada (admin)

### 2. Realizar una Compra
1. `GET /event/future` - Ver eventos disponibles
2. `GET /event/:eventId/ticketType` - Ver tipos de entrada
3. `POST /user/register` o `POST /user/login` - Autenticarse
4. `POST /purchase` - Realizar compra
5. `GET /purchase/:purchaseId/ticket/:ticketId` - Descargar ticket PDF

### 3. Gestión de Usuario
1. `POST /user/register` - Crear cuenta
2. `POST /user/login` - Iniciar sesión (obtener token)
3. `GET /user/tickets/:id` - Ver mis entradas
4. `PATCH /user/:id` - Actualizar perfil

---

*Última actualización: Septiembre 2025*
