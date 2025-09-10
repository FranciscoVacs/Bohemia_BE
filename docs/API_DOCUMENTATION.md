# 📚 Documentación Completa de la API - Bohemia Backend

## 🌟 Información General

**Base URL:** `http://localhost:3000/api`
**Versión:** 2.0
**Autenticación:** JWT Bearer Token
**Última actualización:** Septiembre 2025

### 🔐 Tipos de Permisos
- **🔓 Público:** No requiere autenticación
- **🔒 Autenticado:** Requiere token JWT válido
- **👑 Admin:** Requiere token JWT válido + permisos de administrador
- **👤 Propietario:** Solo el propietario del recurso o admin

### 🚀 Cambios Principales v2.0
- **Endpoints `/me` para usuarios autenticados**
- **Seguridad mejorada en todas las rutas**
- **Estructura simplificada de compras/tickets**
- **PDFs seguros con verificación de propiedad**

---

## 🔐 Autenticación

### Registrar Usuario
**POST** `/user/register`
- **Permisos:** 🔓 Público
- **Propósito:** Crear una nueva cuenta de usuario
- **Content-Type:** `application/json`

```json
{
  "userName": "string",
  "userSurname": "string",
  "email": "string",
  "password": "string",
  "birthDate": "YYYY-MM-DD"
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

---

## 👤 Gestión del Usuario Actual (Endpoints /me)

### Obtener Mi Información
**GET** `/user/me`
- **Permisos:** 🔒 Autenticado
- **Propósito:** Obtener información del usuario autenticado
- **Headers:** `Authorization: Bearer <token>`

### Obtener Mis Compras
**GET** `/user/me/purchases`
- **Permisos:** 🔒 Autenticado
- **Propósito:** Obtener lista de compras del usuario autenticado
- **Respuesta:** Lista de compras con información básica

### Ver Tickets de una Compra Mía
**GET** `/user/me/purchases/:id/tickets`
- **Permisos:** � Autenticado
- **Propósito:** Obtener tickets de una compra específica del usuario
- **Parámetros:** `id` (ID de compra)
- **Verificación:** Solo compras que pertenecen al usuario autenticado

### Actualizar Mi Información
**PATCH** `/user/me`
- **Permisos:** 🔒 Autenticado
- **Propósito:** Modificar información del usuario autenticado
- **Content-Type:** `application/json`

### Eliminar Mi Cuenta
**DELETE** `/user/me`
- **Permisos:** 🔒 Autenticado
- **Propósito:** Eliminar cuenta del usuario autenticado

---

## 👥 Gestión de Usuarios (Solo Admin)

### Listar Todos los Usuarios
**GET** `/user`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Obtener lista de todos los usuarios registrados

### Crear Usuario Manualmente
**POST** `/user`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Crear usuario manualmente (como admin)
- **Content-Type:** `application/json`

### Obtener Usuario por ID
**GET** `/user/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Obtener información de cualquier usuario (solo admin)
- **Parámetros:** `id` (número)

### Actualizar Usuario por ID
**PATCH** `/user/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Modificar información de cualquier usuario (solo admin)
- **Parámetros:** `id` (número)
- **Content-Type:** `application/json`

### Eliminar Usuario por ID
**DELETE** `/user/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Eliminar cualquier cuenta (solo admin)
- **Parámetros:** `id` (número)

---

## 🎉 Gestión de Eventos


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

### Listar Todos los Eventos
**GET** `/event`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Obtener lista completa de eventos

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

### Realizar Compra
**POST** `/purchase`
- **Permisos:** � Autenticado
- **Propósito:** Realizar una nueva compra de entradas
- **Content-Type:** `application/json`
- **⚠️ Estado:** Validación de esquema deshabilitada temporalmente

```json
{
  "ticketTypeId": "number",
  "ticketQuantity": "number",
  "userId": "number"
}
```

### Descargar PDF de Ticket
**GET** `/purchase/:purchaseId/ticket/:ticketId`
- **Permisos:** � Autenticado + 👤 Propietario
- **Propósito:** Generar y descargar PDF de un ticket específico
- **Respuesta:** Archivo PDF
- **Headers de Respuesta:** `Content-Type: application/pdf`, `Content-Disposition: attachment; filename=ticket.pdf`
- **Parámetros:** `purchaseId`, `ticketId`
- **Verificación:** Solo propietario de la compra o admin pueden descargar

---

## 🛒 Gestión de Compras (Solo Admin)

### Listar Todas las Compras
**GET** `/purchase`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Obtener lista de todas las compras del sistema

### Obtener Compra por ID
**GET** `/purchase/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Obtener detalles y tickets de una compra específica
- **Parámetros:** `id` (ID de compra)

### Actualizar Compra
**PATCH** `/purchase/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Modificar compra existente (solo admin)
- **Parámetros:** `id` (número)

### Eliminar Compra
**DELETE** `/purchase/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Cancelar/eliminar compra (solo admin)
- **Parámetros:** `id` (número)

---

## 🎫 Gestión de Tickets (Solo Admin)

### Listar Todos los Tickets
**GET** `/ticket`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Obtener lista de todos los tickets del sistema

### Obtener Ticket por ID
**GET** `/ticket/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Obtener detalles de un ticket específico
- **Parámetros:** `id` (número)

### Crear Ticket Manualmente
**POST** `/ticket`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Crear nuevo ticket manualmente (generalmente no necesario)
- **Content-Type:** `application/json`

### Actualizar Ticket
**PATCH** `/ticket/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Modificar ticket existente
- **Parámetros:** `id` (número)

### Eliminar Ticket
**DELETE** `/ticket/:id`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Eliminar ticket
- **Parámetros:** `id` (número)

**📝 Nota:** Los usuarios regulares acceden a sus tickets a través de `/user/me/purchases/:id/tickets`

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

### Crear Tipo de Entrada
**POST** `/ticketType`
- **Permisos:** � Autenticado + 👑 Admin
- **Propósito:** Crear nuevo tipo de entrada
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
**PATCH** `/ticketType/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Modificar tipo de entrada existente
- **Parámetros:** `id` (número)

### Eliminar Tipo de Entrada
**DELETE** `/ticketType/:id`
- **Permisos:** 🔒 Autenticado + 👑 Admin
- **Propósito:** Eliminar tipo de entrada
- **Parámetros:** `id` (número)

---

## 🔄 Flujos de Usuario Típicos

### 📱 Usuario Regular

1. **Registro/Login**
   ```
   POST /user/register → POST /user/login
   ```

2. **Ver eventos y comprar**
   ```
   GET /event → GET /event/future → POST /purchase
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
   POST /event → POST /ticketType → POST /location
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

## 🚨 Códigos de Error Comunes

- **400 Bad Request:** Datos de entrada inválidos
- **401 Unauthorized:** Token JWT faltante o inválido  
- **403 Forbidden:** Sin permisos suficientes
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Email ya existe (registro)
- **500 Internal Server Error:** Error del servidor

---

## 📋 Notas de Seguridad

### ✅ Implementado
- **JWT Authentication** en todas las rutas protegidas
- **Verificación de propiedad** en recursos de usuario
- **Separación admin/usuario** en endpoints
- **Validación de esquemas** con Zod
- **Verificación de propietario** para descargas de PDF

### 🔐 Headers Requeridos
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### 📝 Endpoints sin validación temporal
- `POST /purchase` (schema comentado)
- `GET /purchase/:purchaseId/ticket/:ticketId` (schema comentado)

---

## 🚧 Funcionalidades Pendientes

### Validación de Esquemas
- **POST /purchase:** CreatePurchaseSchema comentado
- **GET /purchase/:purchaseId/ticket/:ticketId:** UpdatePurchaseSchema comentado

### Mejoras Sugeridas
- Implementar rate limiting
- Agregar logs de auditoría
- Notificaciones por email automáticas
- Sistema de roles más granular

---

## � Información Técnica

### Autenticación JWT
- **Header:** `Authorization: Bearer <token>`
- **Expiración:** 1 hora
- **Payload:** `{id, email, isAdmin}`

### Subida de Archivos
- **Eventos:** Imagen de portada opcional
- **Formato:** `multipart/form-data`
- **Almacenamiento:** `/public/uploads/`

### Generación de PDFs
- **Biblioteca:** PDFKit + QRCode
- **Incluye:** QR único, datos del evento, ticket info
- **Seguridad:** Solo propietario o admin

### Estructura de Respuesta
```json
{
  "message": "string",
  "data": "object|array"
}
```

### Códigos HTTP
- **200:** Éxito
- **201:** Creado
- **400:** Request inválido
- **401:** No autenticado  
- **403:** Sin permisos
- **404:** No encontrado
- **409:** Conflicto (email duplicado)
- **500:** Error servidor

---

**🎯 Documentación actualizada - API v2.0 con seguridad mejorada**
**📅 Última actualización: Septiembre 2025**
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
