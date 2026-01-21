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
import { createEventGalleryRouter } from "./routes/eventGallery.route.js";

/**
 * Clase principal de la aplicación
 * Responsabilidad: Configurar Express y middleware, gestionar el ciclo de vida de la app
 */
export class App {
  private express: Express;
  private container: Container;

  constructor(container: Container) {
    this.container = container;
    this.express = express();
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
      throw new InternalServerError("⚠️  Couldn't find .env file  ⚠️");
    }
  }

  /**
   * Configura el middleware básico de Express
   */
  private configureMiddleware(): void {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Middleware básico
    this.express.use(express.json());
    this.express.use(corsMiddleware());
    this.express.disable("x-powered-by");

    // Archivos estáticos
    this.express.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

    // MikroORM RequestContext - Crítico para el manejo de transacciones
    this.express.use((req, res, next) => {
      RequestContext.create(orm.em, next);
    });
  }

  /**
   * Configura todas las rutas de la API
   */
  private configureRoutes(): void {
    // Rutas de la API - usando el container para obtener modelos
    this.express.use("/api/event", createEventRouter({
      eventModel: this.container.getEventModel()
    }));

    this.express.use("/api/location", createLocationRouter({
      locationModel: this.container.getLocationModel()
    }));

    this.express.use("/api/city", createCityRouter({
      cityModel: this.container.getCityModel()
    }));

    this.express.use("/api/event/:eventId/ticketType", createTicketTypeRouter({
      ticketTypeModel: this.container.getTicketTypeModel()
    }));

    this.express.use("/api/ticket", createTicketRouter({
      ticketModel: this.container.getTicketModel()
    }));

    this.express.use("/api/user", createUserRouter({
      userModel: this.container.getUserModel()
    }));

    this.express.use("/api/purchase", createPurchaseRouter({
      purchaseModel: this.container.getPurchaseModel()
    }));

    this.express.use("/api/dj", createDjRouter({
      djModel: this.container.getDjModel()
    }));

    this.express.use("/api/event-gallery", createEventGalleryRouter({
      eventGalleryModel: this.container.getEventGalleryModel(),
      eventModel: this.container.getEventModel()
    }));
  }

  /**
   * Configura el manejo de errores (debe ir al final)
   */
  private configureErrorHandling(): void {
    this.express.use(errorHandler);
  }

  /**
   * Inicia el servidor HTTP
   */
  async start(): Promise<void> {
    // Sincronizar esquema de base de datos
    await syncSchema();

    const PORT = process.env.PORT ?? 3000;

    this.express.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  }
}
