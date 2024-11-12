import { createApp } from './app.js';
import { BaseModel } from './models/orm/base.Model.js';
import { EventModel } from './models/orm/event.model.js';
import { TicketType } from './entities/ticketType.entity.js';
import { orm } from './shared/db/orm.js';
import { Ticket } from './entities/ticket.entity.js';
import { Purchase } from './entities/purchase.entity.js';
import { UserModel } from './models/orm/user.model.js';
import { LocationModel } from './models/orm/location.model.js';
import { CityModel } from './models/orm/city.model.js';

// Función para generar un nuevo EntityManager `fork()` para cada solicitud
const getEntityManager = () => orm.em.fork();

// Llama a getEntityManager() para cada modelo, obteniendo una nueva instancia del EntityManager
const cityModel = new CityModel(getEntityManager());
const locationModel = new LocationModel(getEntityManager());
const eventModel = new EventModel(getEntityManager()); //para usar los métodos personalizados
const ticketTypeModel = new BaseModel(getEntityManager(), TicketType);
const ticketModel = new BaseModel(getEntityManager(), Ticket);
const userModel = new UserModel(getEntityManager()); //para métodos de UserModel
const purchaseModel = new BaseModel(getEntityManager(), Purchase);

createApp(eventModel, locationModel, cityModel, ticketTypeModel, ticketModel, userModel, purchaseModel);
