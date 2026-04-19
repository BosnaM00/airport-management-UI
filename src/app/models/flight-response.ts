export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

export interface FlightResponseDTO {
  id: number;
  code: string;
  routeId: number;
  originCity: string;
  originIata: string;
  destCity: string;
  destIata: string;
  departureTime: string;
  arrivalTime: string;
  gate: string | null;
  aircraftId: number | null;
  status: FlightStatus;
}

export interface PassengerInfoDTO {
  userId: string;
  email: string;
  docType: string;
  docNumber: string;
  nationality: string;
  pnr: string;
  bookingStatus: string;
}

export interface FlightDetailResponseDTO {
  id: number;
  code: string;
  routeId: number;
  originCity: string;
  originIata: string;
  destCity: string;
  destIata: string;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  gate: string | null;
  aircraftId: number | null;
  aircraftModel: string | null;
  passengers: PassengerInfoDTO[];
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: { empty: boolean; sorted: boolean; unsorted: boolean };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: { empty: boolean; sorted: boolean; unsorted: boolean };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
