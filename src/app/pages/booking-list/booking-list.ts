import { Component, OnInit } from '@angular/core';
import { BookingResponseDTO } from '../../models/booking-response';
import { BookingService } from '../../services/booking-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css',
})
export class BookingList implements OnInit {

  bookings: BookingResponseDTO[] = [];
  loading = false;
  errorMessage: string | null = null;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void { this.loadBookings(); }

  loadBookings(): void {
    this.loading = true;
    this.errorMessage = null;
    this.bookingService.getMyBookings().subscribe({
      next: bookings => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: err => {
        console.error('Error while loading bookings!', err);
        this.errorMessage = 'Could not load bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  cancel(id: number): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: updated => {
        const idx = this.bookings.findIndex(b => b.id === id);
        if (idx !== -1) this.bookings[idx] = updated;
      },
      error: err => console.error('Cancel failed', err)
    });
  }
}
