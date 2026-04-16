export interface AirportResponseDTO {
  id: number;
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
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
    };

    totalPages: number;
    totalElements: number;
    last: boolean;

}
