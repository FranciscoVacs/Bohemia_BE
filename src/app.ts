import express from "express";
import { corsMiddleware } from "./middlewares/cors.js";
import { createEventosRouter } from "./routes/eventos.route.js";
import { EventoModel } from "./models/eventos.model.js";


const eventoModel = new EventoModel();

export const createApp = () => {
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

createApp();
