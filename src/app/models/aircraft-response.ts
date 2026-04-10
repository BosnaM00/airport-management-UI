export interface AircraftResponseDTO {
  id: number;
  tailNumber: string;
  model: string;
  capacity: number;
  seatMapRef: string | null;
  status: string | null;
}
