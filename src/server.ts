import { createApp } from './app.js'
import { EventModel } from './models/mysql/event.model.js'

const eventModel = new EventModel();

createApp(eventModel);