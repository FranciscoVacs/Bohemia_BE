import { createApp } from './app.js'
import { EventModel } from './models/orm/event.model.js'
import { LocationModel } from './models/orm/location.model.js'
import { CityModel } from './models/orm/city.model.js'
import { TicketTypeModel } from './models/orm/ticketType.model.js'
import { orm } from './shared/db/orm.js'

const em = orm.em;
const locationModel = new LocationModel(em);
const eventModel = new EventModel(em);
const cityModel = new CityModel(em);
const ticketTypeModel = new TicketTypeModel(em);

createApp(eventModel, locationModel, cityModel, ticketTypeModel);