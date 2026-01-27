import type { Event } from "../entities/event.entity.js";

// ============================================
// Interfaces
// ============================================

export interface CityDTO {
  cityName: string;
}

export interface LocationDTO {
  id?: number;
  locationName: string;
  address: string;
  city: CityDTO;
}

export interface DjDTO {
  id?: number;
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
// Gallery Event DTO (Para listado público de galerías)
// ============================================

export interface GalleryEventDTO {
  id: number;
  eventName: string;
  beginDatetime: Date;
  finishDatetime: Date;
  coverPhoto: string;
  location: LocationDTO;
  dj: DjDTO;
}

export function toGalleryEventDTO(event: Event): GalleryEventDTO {
  return {
    id: event.id,
    eventName: event.eventName,
    beginDatetime: event.beginDatetime,
    finishDatetime: event.finishDatetime,
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
  beginDatetime?: Date;
  finishDatetime?: Date;
  price: number;
  availableTickets: number;
  isSaleActive: boolean;
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
    isSaleActive: tt.isSaleActive(),
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
    isSaleActive: tt.isSaleActive(),
  }));
}

// ============================================
// Admin DTO (Solo para administradores)
// ============================================

export interface TicketTypeDTO {
  id: number;
  ticketTypeName: string;
  beginDatetime?: Date;
  finishDatetime?: Date;
  price: number;
  maxQuantity: number;
  availableTickets: number;
  saleMode: string;
  isManuallyActivated: boolean;
  isSaleActive: boolean;
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
  isGalleryPublished: boolean;
  isPublished: boolean;
}

export function toAdminEventDTO(event: Event): AdminEventDTO {
  const ticketTypesArray = event.ticketType.getItems();

  const ticketTypes: TicketTypeDTO[] = ticketTypesArray.map(tt => ({
    id: tt.id,
    ticketTypeName: tt.ticketTypeName,
    beginDatetime: tt.beginDatetime,
    finishDatetime: tt.finishDatetime,
    price: tt.price,
    maxQuantity: tt.maxQuantity,
    availableTickets: tt.availableTickets,
    saleMode: tt.saleMode,
    isManuallyActivated: tt.isManuallyActivated,
    isSaleActive: tt.isSaleActive(),
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
      id: event.location.id,
      locationName: event.location.locationName,
      address: event.location.address,
      city: {
        cityName: event.location.city.cityName,
      }
    },
    dj: {
      id: event.dj.id,
      djApodo: event.dj.djApodo,
    },
    ticketTypes,
    isGalleryPublished: event.isGalleryPublished,
    isPublished: event.isPublished,
  };
}