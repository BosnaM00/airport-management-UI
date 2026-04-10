export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'CHECKED_IN';

export interface BookingUpdateDTO {
  pnr: string;
  flight: string;
  passenger: string;
  bookingStatus: BookingStatus;
  }
