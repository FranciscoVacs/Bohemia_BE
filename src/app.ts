import express from "express";
import "reflect-metadata";
import { RequestContext } from "@mikro-orm/core";
import { corsMiddleware } from "./middlewares/cors.js";
import { orm, syncSchema } from "./shared/db/orm.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createEventRouter } from "./routes/event.route.js";
import type { IEventModel } from "./interfaces/event.model.interface.js";
import { createLocationRouter } from "./routes/location.route.js";
import type { ILocationModel } from "./interfaces/location.model.interface.js";
import { createCityRouter } from "./routes/city.route.js";
import type { ICityModel } from "./interfaces/city.model.interface.js";
import { createTicketTypeRouter } from "./routes/ticketType.route.js";
import type { ITicketTypeModel } from "./interfaces/ticketType.model.interface.js";

export const createApp = async (
  eventModel: IEventModel,
  locationModel: ILocationModel,
  cityModel: ICityModel,
  ticketTypeModel: ITicketTypeModel,
) => {
  const app = express();
  app.use(express.json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
  });

  app.use("/api/event", createEventRouter({ eventModel }));
  app.use("/api/location", createLocationRouter({ locationModel }));
  app.use("/api/city", createCityRouter({ cityModel }));
  app.use("/api/ticketType", createTicketTypeRouter({ ticketTypeModel }));

  app.use(errorHandler);

  await syncSchema();

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
};
