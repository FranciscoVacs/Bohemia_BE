import { createApp } from './app.js'
import { EventoModel } from './models/mysql/eventos.model.js'


const eventoModel = new EventoModel();

createApp(eventoModel);