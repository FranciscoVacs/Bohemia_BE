import { createApp } from './app.js'
import { BaseModel } from './models/orm/baseModel.js'
import { EventModel } from './models/orm/event.model.js'
import { City } from './entities/city.entity.js'
import { Location } from './entities/location.entity.js'
import { TicketType } from './entities/ticketType.entity.js'
import { orm } from './shared/db/orm.js'
import { Ticket } from './entities/ticket.entity.js'
import { Purchase } from './entities/purchase.entity.js'
import { UserModel } from './models/orm/user.model.js'


const em = orm.em;
const cityModel = new BaseModel(em, City);
const locationModel = new BaseModel(em, Location);
const eventModel = new EventModel(em); //para usar los metodos personalizados instanciar con EventModel, sino usa siempre los de BaseMOdel
const ticketTypeModel = new BaseModel(em, TicketType);
const ticketModel = new BaseModel(em, Ticket);
const userModel = new UserModel(em);// para los nuevos metodos cambiar basemodel por usermodel
const purchaseModel = new BaseModel(em, Purchase);

createApp(eventModel, locationModel, cityModel, ticketTypeModel, ticketModel, userModel, purchaseModel);