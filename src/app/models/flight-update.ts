export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

// Update uses the same shape as create (backend reuses FlightCreateDTO for both)
export interface FlightUpdateDTO {
  code: string;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  gate?: string | null;
  aircraftId?: number | null;
}
