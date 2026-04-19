export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

export interface FlightCreateDTO {
  code: string;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  gate?: string | null;
  aircraftId?: number | null;
}
