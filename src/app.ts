import express from "express";
import "reflect-metadata";
import { RequestContext } from "@mikro-orm/core";
import { corsMiddleware } from "./middlewares/cors.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createEventRouter } from "./routes/event.route.js";
import { createLocationRouter } from "./routes/location.route.js";
import { createCityRouter } from "./routes/city.route.js";
import { createTicketTypeRouter } from "./routes/ticketType.route.js";
import { createTicketRouter } from "./routes/ticket.route.js";
import { createUserRouter } from "./routes/user.route.js";
import { createPurchaseRouter } from "./routes/purchase.route.js";
import { createDjRouter } from "./routes/dj.route.js";
import { Container } from "./shared/container.js";
import { InternalServerError } from "./shared/errors/AppError.js";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import type { Express } from "express";
import { createEventPhotoRouter } from "./routes/eventPhoto.route.js";

/**
 * Clase principal de la aplicación
 * Responsabilidad: Configurar Express y middleware, gestionar el ciclo de vida de la app
 */
export class App {
  public expressApp: Express;
  private container: Container;

  constructor(container: Container) {
    this.container = container;
    this.expressApp = express();
    this.loadEnvironment();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  /**
   * Carga y valida las variables de entorno
   */
  private loadEnvironment(): void {
    const envFound = dotenv.config();
    if (envFound.error) {
      console.warn("⚠️  .env file not found — using environment variables from host");
    }
  }

  /**
   * Configura el middleware básico de Express
   */
  private configureMiddleware(): void {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Log de todas las requests entrantes
    this.expressApp.use((req, res, next) => {
      console.log(`[REQUEST] ${req.method} ${req.url} | Origin: ${req.headers.origin ?? 'none'}`);
      next();
    });

    // Middleware básico
    this.expressApp.use(express.json());
    this.expressApp.use(corsMiddleware());
    this.expressApp.disable("x-powered-by");

    // Archivos estáticos
    this.expressApp.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

    // MikroORM RequestContext - Crítico para el manejo de transacciones
    this.expressApp.use((req, res, next) => {
      RequestContext.create(orm.em, next);
    });
  }

  /**
   * Configura todas las rutas de la API
   */
  private configureRoutes(): void {
// Rutas de la API - usando el container para obtener modelos
    this.expressApp.use("/api/event", createEventRouter({
      eventModel: this.container.getEventModel(),
      getEntityManager: this.container.getEntityManager.bind(this.container)
    }));

    this.expressApp.use("/api/location", createLocationRouter({
      locationModel: this.container.getLocationModel()
    }));

    this.expressApp.use("/api/city", createCityRouter({
      cityModel: this.container.getCityModel()
    }));

    this.expressApp.use("/api/event/:eventId/ticketType", createTicketTypeRouter({
      ticketTypeModel: this.container.getTicketTypeModel()
    }));

    this.expressApp.use("/api/ticket", createTicketRouter({
      ticketModel: this.container.getTicketModel()
    }));

    this.expressApp.use("/api/user", createUserRouter({
      userModel: this.container.getUserModel()
    }));

    this.expressApp.use("/api/purchase", createPurchaseRouter({
      purchaseModel: this.container.getPurchaseModel()
    }));

    this.expressApp.use("/api/dj", createDjRouter({
      djModel: this.container.getDjModel()
    }));

    this.expressApp.use("/api/event-photos", createEventPhotoRouter({
      eventPhotoModel: this.container.getEventPhotoModel(),
      eventModel: this.container.getEventModel()
    }));
  }

  /**
   * Configura el manejo de errores (debe ir al final)
   */
  private configureErrorHandling(): void {
    this.expressApp.use(errorHandler);
  }
  /**
   * SOLO para inicializar la base de datos (útil para los tests)
   */
  async initializeDatabase(): Promise<void> {
     await syncSchema();
  }
  /**
   * Inicia el servidor HTTP
   */
  async start(): Promise<void> {
    // Sincronizar esquema de base de datos
    await this.initializeDatabase();

    const PORT = process.env.PORT ?? 3000;

    this.expressApp.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  }
}
