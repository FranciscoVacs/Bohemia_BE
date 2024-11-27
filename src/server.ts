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
import { Dj } from './entities/dj.entity.js';
import { TicketTypeModel } from './models/orm/ticketType.model.js';
import { PurchaseModel } from './models/orm/purchase.model.js';

// Función para generar un nuevo EntityManager `fork()` para cada solicitud
const getEntityManager = () => orm.em.fork();

// Llama a getEntityManager() para cada modelo, obteniendo una nueva instancia del EntityManager
const djModel = new BaseModel(getEntityManager(), Dj);
const cityModel = new CityModel(getEntityManager());
const locationModel = new LocationModel(getEntityManager());
const eventModel = new EventModel(getEntityManager()); //para usar los métodos personalizados
const ticketTypeModel = new TicketTypeModel(getEntityManager());//para usar los métodos personalizados
const ticketModel = new BaseModel(getEntityManager(), Ticket);
const userModel = new UserModel(getEntityManager()); //para métodos nuevos de UserModel
const purchaseModel = new PurchaseModel(getEntityManager());//para métodos nuevos de PurhcaseModel

createApp(eventModel, locationModel, cityModel, ticketTypeModel, ticketModel, userModel, purchaseModel, djModel);
