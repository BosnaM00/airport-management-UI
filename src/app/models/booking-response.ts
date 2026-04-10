export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN';

export interface BookingResponseDTO {
  id: number;
  pnr: string;
  passengerId: string;
  flightId: number;
  status: BookingStatus;
}
