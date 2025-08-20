# 🎉 Bohemia Backend

**Sistema de gestión de eventos y venta de entradas para fiestas y eventos en Argentina**

[![Node.js](https://img.shields.io/badge/Node.js-20.12.12-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.19.2-black.svg)](https://expressjs.com/)
[![MikroORM](https://img.shields.io/badge/MikroORM-6.3.8-orange.svg)](https://mikro-orm.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg)](https://www.mysql.com/)

## 📋 Descripción del Proyecto

Bohemia es una plataforma web para la gestión y venta de entradas para eventos y fiestas en diferentes provincias de Argentina. El sistema permite a los usuarios registrarse, explorar eventos, comprar entradas con diferentes métodos de pago, y recibir entradas con códigos QR.

### ✨ Características Principales

- 🎫 **Gestión de Eventos**: Crear y administrar eventos con fechas, ubicaciones y descripciones
- 🏙️ **Múltiples Provincias**: Eventos distribuidos en diferentes provincias argentinas
- 📍 **Sistema de Locaciones**: Gestión de lugares con capacidad máxima y direcciones
- 👥 **Gestión de Usuarios**: Registro, autenticación y perfiles de usuarios
- 💳 **Venta de Entradas**: Sistema de compra con diferentes métodos de pago
- 🎯 **Sistema de Tandas**: Precios escalonados por tiempo (preventa, primera tanda, etc.)
- 🏷️ **Códigos de Descuento**: Descuentos aplicables por evento y entrada
- 📱 **Entradas con QR**: Generación automática de códigos QR para cada entrada
- 📧 **Notificaciones**: Envío de recibos y entradas por correo electrónico
- 📸 **Galería de Fotos**: Álbumes de fotos para usuarios registrados
- 🔐 **Autenticación JWT**: Sistema seguro de login y autorización
- 📄 **Generación de PDFs**: Recibos y entradas en formato PDF
- ⏰ **Eventos Futuros Inteligentes**: Filtrado automático de eventos por estado temporal

## 🏗️ Arquitectura del Sistema

### Entidades Principales

```
📊 Base de Datos
├── 🏛️ province (provincias)
├── 📍 location (locaciones)
├── 🎉 event (eventos)
├── 👤 user (usuarios)
├── 🎫 ticket_batch (tandas de entradas)
├── 🎟️ ticket (entradas)
├── 🛒 purchase (compras)
└── 🏷️ discount_code (códigos de descuento)
```

### Relaciones Clave

- **Provincia** → **Locaciones** (1:N)
- **Locación** → **Eventos** (1:N)
- **Evento** → **Tandas** (1:N)
- **Evento** → **Códigos de Descuento** (1:N)
- **Usuario** → **Compras** (1:N)
- **Compra** → **Entradas** (1:N)
- **Tanda** → **Entradas** (1:N)

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Lenguaje de programación tipado
- **Express.js** - Framework web
- **MikroORM** - ORM para base de datos
- **MySQL** - Base de datos relacional

### Autenticación y Seguridad
- **JWT** - Tokens de autenticación
- **bcrypt** - Hash de contraseñas
- **CORS** - Control de acceso entre dominios

### Manejo de Archivos
- **Multer** - Middleware para upload de archivos
- **PDFKit** - Generación de PDFs
- **QRCode** - Generación de códigos QR

### Validación y Utilidades
- **Zod** - Validación de esquemas
- **date-fns** - Manipulación de fechas
- **UUID** - Generación de identificadores únicos

### Pagos
- **MercadoPago** - Procesamiento de pagos

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js 20.12.12 o superior
- MySQL 8.0 o superior
- pnpm (recomendado) o npm

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd Bohemia_BE
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bohemia_db
DB_USER=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# MercadoPago
MP_ACCESS_TOKEN=your_mercadopago_access_token

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Configurar Base de Datos

```sql
CREATE DATABASE bohemia_db;
USE bohemia_db;
```

### 5. Ejecutar Migraciones

```bash
pnpm run build
# Las entidades se crearán automáticamente al ejecutar la aplicación
```

## 🎯 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm start:dev` | **Desarrollo**: Compila y ejecuta con hot-reload |
| `pnpm run build` | **Producción**: Compila el proyecto TypeScript |
| `pnpm run clean` | **Limpieza**: Elimina la carpeta dist |
| `pnpm run rebuild` | **Reconstrucción**: Limpia y recompila |

## 🏃‍♂️ Ejecutar el Proyecto

### Desarrollo
```bash
pnpm start:dev
```

### Producción
```bash
pnpm run build
node ./dist/server.js
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Estructura del Proyecto

```
Bohemia_BE/
├── 📁 src/
│   ├── 📁 controllers/     # Controladores de la API
│   ├── 📁 entities/        # Entidades de MikroORM
│   ├── 📁 HTTP/            # Archivos HTTP de prueba
│   ├── 📁 interfaces/      # Interfaces TypeScript
│   ├── 📁 middlewares/     # Middlewares de Express
│   ├── 📁 models/          # Modelos de datos
│   ├── 📁 routes/          # Rutas de la API
│   ├── 📁 schemas/         # Esquemas de validación Zod
│   ├── 📁 services/        # Servicios de negocio
│   ├── 📁 shared/          # Utilidades compartidas
│   ├── 📄 app.ts           # Configuración de la aplicación
│   └── 📄 server.ts        # Servidor principal
├── 📁 docs/                # Documentación del proyecto
├── 📁 public/              # Archivos públicos y uploads
├── 📄 package.json         # Dependencias y scripts
└── 📄 tsconfig.json        # Configuración de TypeScript
```

## 🔌 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login de usuarios

### Eventos
- `GET /api/events` - Listar todos los eventos
- `GET /api/events/future` - **NUEVO**: Solo eventos futuros y en curso
- `POST /api/events` - Crear evento
- `GET /api/events/:id` - Obtener evento por ID
- `PUT /api/events/:id` - Actualizar evento
- `DELETE /api/events/:id` - Eliminar evento

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Compras y Entradas
- `POST /api/purchases` - Crear compra
- `GET /api/purchases` - Listar compras
- `GET /api/tickets` - Listar entradas
- `GET /api/tickets/:id` - Obtener entrada por ID

### Ubicaciones
- `GET /api/cities` - Listar ciudades
- `GET /api/locations` - Listar locaciones
- `POST /api/locations` - Crear locación

## 🆕 Nueva Funcionalidad: Eventos Futuros Inteligentes

### Endpoint Especializado
```
GET /api/events/future
```

### 🎯 Lógica de Filtrado Inteligente

**Un evento aparece en "futuros" si NO ha terminado completamente:**

- ✅ **Eventos que aún no empiezan** - Aparecen normalmente
- ✅ **Eventos en curso** - Siguen apareciendo hasta que terminen
- ❌ **Eventos terminados** - Desaparecen automáticamente

### 📊 Ejemplos de Comportamiento

#### Escenario 1: Evento Futuro
- **Hora actual**: 10:00 AM
- **Evento**: Empieza 8:00 PM, termina 6:00 AM del día siguiente
- **Resultado**: ✅ **APARECE** en `/api/events/future`

#### Escenario 2: Evento En Curso
- **Hora actual**: 11:00 PM
- **Evento**: Empezó 8:00 PM, termina 6:00 AM del día siguiente
- **Resultado**: ✅ **APARECE** en `/api/events/future` (está en curso)

#### Escenario 3: Evento Terminado
- **Hora actual**: 7:00 AM del día siguiente
- **Evento**: Empezó 8:00 PM, terminó 6:00 AM
- **Resultado**: ❌ **NO APARECE** en `/api/events/future` (ya terminó)

### 💡 Beneficios

1. **Experiencia de Usuario Mejorada** - Los usuarios ven eventos hasta que terminen
2. **Lógica Intuitiva** - Un evento "futuro" es uno que no ha terminado
3. **API Pública** - No requiere autenticación para consultar eventos
4. **Filtrado Automático** - Los eventos desaparecen automáticamente al terminar
5. **Incluye Eventos en Curso** - Los usuarios pueden ver eventos que ya empezaron

### 🔧 Implementación Técnica

```typescript
// Filtrado por fecha de finalización, no de inicio
const futureEvents = allEvents.filter(event => 
  new Date(event.finish_datetime) > now
);
```

## 🔐 Autenticación y Autorización

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. **Registro**: Usuario se registra con email, contraseña y datos personales
2. **Login**: Usuario inicia sesión y recibe un token JWT
3. **Autorización**: Token se incluye en el header `Authorization: Bearer <token>`
4. **Middleware**: `auth.ts` valida el token en rutas protegidas

## 💳 Sistema de Pagos

Integración con **MercadoPago** para procesar pagos:

- Soporte para múltiples métodos de pago
- Procesamiento seguro de transacciones
- Generación automática de entradas tras confirmación de pago
- Envío de recibos por email

## 📸 Manejo de Archivos

### Upload de Imágenes
- **Multer** para procesar archivos multipart
- Almacenamiento en `public/uploads/`
- Validación de tipos de archivo
- Generación de nombres únicos

### Generación de PDFs
- **PDFKit** para crear recibos y entradas
- Inclusión de códigos QR
- Formato profesional y legible

## 🧪 Testing

### Ejecutar Tests de MercadoPago
```bash
pnpm run test:mercadopago
```

## 📊 Base de Datos

### Configuración
- **ORM**: MikroORM con MySQL
- **Migraciones**: Automáticas al ejecutar la aplicación
- **Relaciones**: Definidas con decoradores de MikroORM

### Entidades Principales

#### Event
```typescript
@Entity()
export class Event {
  @PrimaryKey()
  id!: number;
  
  @Property()
  begin_datetime!: Date;
  
  @Property()
  finish_datetime!: Date;
  
  @Property()
  description!: string;
  
  @Property()
  min_age!: number;
  
  @ManyToOne(() => Location)
  location!: Location;
}
```

## 🚨 Reglas de Negocio

### Eventos
- ✅ No se pospondrá por inconvenientes climáticos ya que son en lugares cerrados
- ✅ Capacidad máxima por locación
- ✅ Edad mínima configurable
- ✅ **NUEVO**: Validaciones robustas de fechas (futuras y lógicas)

### Entradas
- ✅ Stock limitado por tanda
- ✅ Precios escalonados por tiempo
- ✅ Códigos de descuento únicos por entrada
- ✅ Generación automática de QR

### Compras
- ✅ Sin reembolsos de entradas
- ✅ Validación de stock disponible
- ✅ Generación de entradas tras confirmación de pago

### Validaciones de Fechas
- ✅ **Fecha de inicio** debe ser futura
- ✅ **Fecha de fin** debe ser futura
- ✅ **Fecha de fin** debe ser posterior a **fecha de inicio**
- ✅ **No se pueden actualizar** eventos con fechas contradictorias

## 🔧 Configuración de Desarrollo

### Variables de Entorno de Desarrollo
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bohemia_dev
```

### Hot Reload
El proyecto utiliza `tsc-watch` para compilación automática en desarrollo:
- Detecta cambios en archivos `.ts`
- Recompila automáticamente
- Reinicia el servidor

## 📝 Notas de Desarrollo

### Dudas y Consideraciones
- Validación de capacidad máxima de locaciones vs. tickets
- Control de stock de entradas
- Estados de tickets types (agotado, disponible)
- Sistema de administradores para gestión de eventos
- Almacenamiento de fotos en galería

### Implementaciones Pendientes
- [ ] Sistema de roles de administrador
- [ ] Gestión de álbumes de fotos
- [ ] Tests unitarios y de integración
- [ ] Documentación de API con Swagger

### ✅ Implementaciones Completadas
- [x] **Validaciones robustas de fechas** para eventos
- [x] **API de eventos futuros** con lógica inteligente
- [x] **Filtrado automático** por estado temporal
- [x] **Validaciones en actualizaciones** para prevenir fechas contradictorias

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

**Bohemia Development Team**

**¡Disfruta desarrollando con Bohemia! 🎉**


