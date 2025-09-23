import { BaseModel } from '../models/orm/base.Model.js';
import { EventModel } from '../models/orm/event.model.js';
import { LocationModel } from '../models/orm/location.model.js';
import { CityModel } from '../models/orm/city.model.js';
import { UserModel } from '../models/orm/user.model.js';
import { PurchaseModel } from '../models/orm/purchase.model.js';
import { TicketTypeModel } from '../models/orm/ticketType.model.js';
import { EventImageModel } from '../models/orm/eventImage.model.js';

import { Event } from '../entities/event.entity.js';
import { Location } from '../entities/location.entity.js';
import { City } from '../entities/city.entity.js';
import { TicketType } from '../entities/ticketType.entity.js';
import { Ticket } from '../entities/ticket.entity.js';
import { User } from '../entities/user.entity.js';
import { Purchase } from '../entities/purchase.entity.js';
import { Dj } from '../entities/dj.entity.js';
import { EventImage } from '../entities/eventImage.entity.js';

import { orm } from './db/orm.js';
import type { EntityManager } from '@mikro-orm/mysql';
import type { IModel } from '../interfaces/model.interface.js';
import type { IUserModel } from '../interfaces/user.interface.js';
import type { IPurchaseModel } from '../interfaces/purchase.interface.js';
import type { ITicketTypeModel } from '../interfaces/ticketType.interface.js';
import type { IEventImageModel } from '../interfaces/eventImage.interface.js';

/**
 * Dependency Injection Container
 * Centraliza la creación y configuración de todas las dependencias
 */
export class Container {
  private models: Map<string, any> = new Map();

  /**
   * Obtiene un EntityManager fork para cada solicitud
   * Esto es importante para el manejo de transacciones en MikroORM
   */
  private getEntityManager(): EntityManager {
    return orm.em.fork();
  }

  /**
   * Lazy loading de modelos - se crean solo cuando se necesitan
   * 
   * LÓGICA PRAGMÁTICA:
   * - Modelo específico: Si tiene métodos custom (getByEmail, createProtocol, etc.)
   * - BaseModel: Si solo usa CRUD básico (getAll, getById, create, update, delete)
   */
  // ✅ Modelos específicos - Tienen métodos custom
  getEventModel(): EventModel {
    if (!this.models.has('eventModel')) {
      this.models.set('eventModel', new EventModel(this.getEntityManager())); // Custom getById con populate
    }
    return this.models.get('eventModel');
  }

  getLocationModel(): IModel<Location> {
    if (!this.models.has('locationModel')) {
      this.models.set('locationModel', new LocationModel(this.getEntityManager())); // Custom getById con populate
    }
    return this.models.get('locationModel');
  }

  getCityModel(): IModel<City> {
    if (!this.models.has('cityModel')) {
      this.models.set('cityModel', new CityModel(this.getEntityManager())); // Custom getById con populate
    }
    return this.models.get('cityModel');
  }

  getUserModel(): IUserModel<User> {
    if (!this.models.has('userModel')) {
      this.models.set('userModel', new UserModel(this.getEntityManager())); // Custom getByEmail, showTickets
    }
    return this.models.get('userModel');
  }

  getPurchaseModel(): IPurchaseModel<Purchase> {
    if (!this.models.has('purchaseModel')) {
      this.models.set('purchaseModel', new PurchaseModel(this.getEntityManager())); // Custom createProtocol
    }
    return this.models.get('purchaseModel');
  }


  getTicketTypeModel(): ITicketTypeModel<TicketType> {
    if (!this.models.has('ticketTypeModel')) {
      this.models.set('ticketTypeModel', new TicketTypeModel(this.getEntityManager())); // Custom getTotalMaxQuantityByEvent, getEventWithLocation  
    }
    return this.models.get('ticketTypeModel');
  }

  getEventImageModel(): IEventImageModel<EventImage> {
  if (!this.models.has('eventImageModel')) {
    this.models.set('eventImageModel', new EventImageModel(this.getEntityManager()));
  }
  return this.models.get('eventImageModel');
}

// ✅ BaseModel - Solo CRUD básico
  getTicketModel(): IModel<Ticket> {
    if (!this.models.has('ticketModel')) {
      this.models.set('ticketModel', new BaseModel(this.getEntityManager(), Ticket)); // Solo CRUD básico
    }
    return this.models.get('ticketModel');
  }

  getDjModel(): IModel<Dj> {
    if (!this.models.has('djModel')) {
      this.models.set('djModel', new BaseModel(this.getEntityManager(), Dj)); // Solo CRUD básico
    }
    return this.models.get('djModel');
  }
}
