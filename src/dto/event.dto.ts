import type { Event } from "../entities/event.entity.js";

// ============================================
// Interfaces
// ============================================

export interface CityDTO {
  cityName: string;
}

export interface LocationDTO {
  locationName: string;
  address: string;
  city: CityDTO;
}

export interface DjDTO {
  djApodo: string;
}

export interface FutureEventDTO {
  eventName: string;
  beginDatetime: Date;
  finishDatetime: Date;
  eventDescription: string;
  minAge: number;
  coverPhoto: string;
  location: LocationDTO;
  dj: DjDTO;
}

// ============================================
// Transformadores
// ============================================

export function toFutureEventDTO(event: Event): FutureEventDTO {
  return {
    eventName: event.eventName,
    beginDatetime: event.beginDatetime,
    finishDatetime: event.finishDatetime,
    eventDescription: event.eventDescription,
    minAge: event.minAge,
    coverPhoto: event.coverPhoto,
    location: {
      locationName: event.location.locationName,
      address: event.location.address,
      city: {
        cityName: event.location.city.cityName,
      }
    },
    dj: {
      djApodo: event.dj.djApodo,
    }
  };
}

// ============================================
// Public DTO (Para endpoints públicos con ID)
// ============================================

export interface PublicTicketTypeDTO {
  id: number;
  ticketTypeName: string;
  beginDatetime: Date;
  finishDatetime: Date;
  price: number;
  availableTickets: number;
}

export interface PublicEventDTO {
  id: number;
  eventName: string;
  beginDatetime: Date;
  finishDatetime: Date;
  eventDescription: string;
  minAge: number;
  coverPhoto: string;
  location: LocationDTO;
  dj: DjDTO;
  ticketTypes: PublicTicketTypeDTO[];
}

export function toPublicEventDTO(event: Event): PublicEventDTO {
  const ticketTypesArray = event.ticketType.getItems();

  const ticketTypes: PublicTicketTypeDTO[] = ticketTypesArray.map(tt => ({
    id: tt.id,
    ticketTypeName: tt.ticketTypeName,
    beginDatetime: tt.beginDatetime,
    finishDatetime: tt.finishDatetime,
    price: tt.price,
    availableTickets: tt.availableTickets,
  }));

  return {
    id: event.id,
    eventName: event.eventName,
    beginDatetime: event.beginDatetime,
    finishDatetime: event.finishDatetime,
    eventDescription: event.eventDescription,
    minAge: event.minAge,
    coverPhoto: event.coverPhoto,
    location: {
      locationName: event.location.locationName,
      address: event.location.address,
      city: {
        cityName: event.location.city.cityName,
      }
    },
    dj: {
      djApodo: event.dj.djApodo,
    },
    ticketTypes,
  };
}

export function toPublicTicketTypesDTO(event: Event): PublicTicketTypeDTO[] {
  return event.ticketType.getItems().map(tt => ({
    id: tt.id,
    ticketTypeName: tt.ticketTypeName,
    beginDatetime: tt.beginDatetime,
    finishDatetime: tt.finishDatetime,
    price: tt.price,
    availableTickets: tt.availableTickets,
  }));
}

// ============================================
// Admin DTO (Solo para administradores)
// ============================================

export interface TicketTypeDTO {
  id: number;
  ticketTypeName: string;
  beginDatetime: Date;
  finishDatetime: Date;
  price: number;
  maxQuantity: number;
  availableTickets: number;
}

export interface AdminEventDTO {
  id: number;
  eventName: string;
  beginDatetime: Date;
  finishDatetime: Date;
  eventDescription: string;
  minAge: number;
  coverPhoto: string;
  location: LocationDTO;
  dj: DjDTO;
  ticketTypes: TicketTypeDTO[];
  // Campos calculados
  isSoldOut: boolean;
  totalTicketsSold: number;
  totalRevenue: number;
}

export function toAdminEventDTO(event: Event): AdminEventDTO {
  // Calcular métricas desde los ticketTypes
  const ticketTypesArray = event.ticketType.getItems();

  let totalTicketsSold = 0;
  let totalRevenue = 0;
  let isSoldOut = true;

  const ticketTypes: TicketTypeDTO[] = ticketTypesArray.map(tt => {
    const sold = tt.maxQuantity - tt.availableTickets;
    totalTicketsSold += sold;
    totalRevenue += sold * tt.price;

    if (tt.availableTickets > 0) {
      isSoldOut = false;
    }

    return {
      id: tt.id,
      ticketTypeName: tt.ticketTypeName,
      beginDatetime: tt.beginDatetime,
      finishDatetime: tt.finishDatetime,
      price: tt.price,
      maxQuantity: tt.maxQuantity,
      availableTickets: tt.availableTickets,
    };
  });

  // Si no hay ticketTypes, no está sold out
  if (ticketTypesArray.length === 0) {
    isSoldOut = false;
  }

  return {
    id: event.id,
    eventName: event.eventName,
    beginDatetime: event.beginDatetime,
    finishDatetime: event.finishDatetime,
    eventDescription: event.eventDescription,
    minAge: event.minAge,
    coverPhoto: event.coverPhoto,
    location: {
      locationName: event.location.locationName,
      address: event.location.address,
      city: {
        cityName: event.location.city.cityName,
      }
    },
    dj: {
      djApodo: event.dj.djApodo,
    },
    ticketTypes,
    isSoldOut,
    totalTicketsSold,
    totalRevenue,
  };
}