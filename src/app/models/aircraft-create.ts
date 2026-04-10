export interface AircraftCreateDTO {
  tailNumber: string;
  model: string;
  capacity: number;
  seatMapRef?: string;
  status?: string;
}
