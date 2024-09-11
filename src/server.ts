import { createApp } from './app.js'
import { EventModel } from './models/orm/event.model.js'
import { LocationModel } from './models/orm/location.model.js'
import { orm } from './shared/db/orm.js'

const em = orm.em;
const locationModel = new LocationModel(em);
const eventModel = new EventModel(em);

createApp(eventModel, locationModel);