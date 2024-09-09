import express from "express";
import 'reflect-metadata';
import { corsMiddleware } from "./middlewares/cors.js";
import { createEventRouter } from "./routes/event.route.js";
import{ orm, syncSchema } from "./shared/db/orm.js";
import type { IEventModel } from "./interfaces/event.model.interface.js";
import { RequestContext } from "@mikro-orm/core";


export const createApp = async (eventModel:IEventModel) => {
  const app = express();
  app.use(express.json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");


  app.use((req,res,next)=>{
    RequestContext.create(orm.em, next);
  });


  app.use("/api/event", createEventRouter({ eventModel }));

  const PORT = process.env.PORT ?? 3000;

  await syncSchema();

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
};

