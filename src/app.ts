import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createEventosRouter } from "./routes/eventos.route.js";
import type { IEventoModel } from "./interfaces/eventos.model.interface.js";


export const createApp = (eventoModel:IEventoModel) => {
  const app = express();
  app.use(express.json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.use("/api/eventos", createEventosRouter({ eventoModel }));

  const PORT = process.env.PORT ?? 3000;

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
};

