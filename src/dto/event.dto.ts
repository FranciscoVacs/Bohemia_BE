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