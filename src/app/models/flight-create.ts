export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

export interface FlightCreateDTO {
  code: string;
  departureScheduled: string;
  arrivalScheduled: string;
  gate: string;
  aircraftId: string;
  routeId: string;
  }
