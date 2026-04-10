import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookingCreateDTO } from '../models/booking-create';
import { BookingResponseDTO } from '../models/booking-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {

  constructor(private http: HttpClient) {}
  private url = `http://localhost:8080/api/bookings`;

  getBookingById(id: number): Observable<BookingResponseDTO> {
    return this.http.get<BookingResponseDTO>(`${this.url}/${id}`);
  }

  getMyBookings(): Observable<BookingResponseDTO[]> {
    return this.http.get<BookingResponseDTO[]>(this.url);
  }

  createBooking(payload: BookingCreateDTO): Observable<BookingResponseDTO> {
    return this.http.post<BookingResponseDTO>(this.url, payload);
  }

  cancelBooking(id: number): Observable<BookingResponseDTO> {
    return this.http.delete<BookingResponseDTO>(`${this.url}/${id}`);
  }
}
