export type FlightStatus = 'SCHEDULED' | 'BOARDING' | 'DELAYED' | 'CANCELLED' | 'IN_AIR' | 'LANDED';

export interface FlightResponseDTO {
  id: number;
  code: string;
  routeId: number;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
}

export interface PageResponse<T> {
    content: T[];

    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };

    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}
