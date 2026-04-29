export interface RouteResponseDTO {
  id: number;
  originAirportId: number;
  originCity: string;
  originIata: string;
  destAirportId: number;
  destCity: string;
  destIata: string;
  distanceNm: number;
  stdDurationMin: number;
}
