import { createApp } from './app.js'
import { BaseModel } from './models/orm/baseModel.js'
import { City } from './entities/city.entity.js'
import { EventModel } from './models/orm/event.model.js'
import { LocationModel } from './models/orm/location.model.js'
import { CityModel } from './models/orm/city.model.js'
import { TicketTypeModel } from './models/orm/ticketType.model.js'
import { TicketModel } from './models/orm/ticket.model.js'
import { orm } from './shared/db/orm.js'

const em = orm.em;
const cityModel = new BaseModel<City>(em, City);

const locationModel = new LocationModel(em);
const eventModel = new EventModel(em);
//const cityModel = new CityModel(em);
const ticketTypeModel = new TicketTypeModel(em);
const ticketModel = new TicketModel(em);

createApp(eventModel, locationModel, cityModel, ticketTypeModel, ticketModel);