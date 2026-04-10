export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

export interface FlightUpdateDTO {
  code: string;
  departureScheduled: string;
  arrivalScheduled: string;
  gate: string;
  aircraftId: string;
  routeId: string;
  flightStatus: FlightStatus;
  }
