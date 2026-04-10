import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlightCardComponent } from '../components/flight-card/flight-card';
import { FooterComponent } from '../components/footer/footer';
import { FlightService } from '../../services/flight-service';
import { BookingService } from '../../services/booking-service';
import { FlightResponseDTO } from '../../models/flight-response';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    FlightCardComponent,
    FooterComponent,
  ],
  templateUrl: './search-flights.html',
  styleUrls: ['./search-flights.css'],
})
export class SearchFlights {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);

  confirmedPnr: string | null = null;
  bookingError: string | null = null;
  bookingInProgress = false;

  form = this.fb.group({
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    departureDate: [null as Date | null, [Validators.required]],
    returnDate: [null as Date | null],
    adults: [1, [Validators.min(1)]],
    children: [0, [Validators.min(0)]],
  });

  loading = false;
  hasSearched = false;
  flights: FlightResponseDTO[] = [];
  errorMessage: string | null = null;
  searchedFrom = '';
  searchedTo = '';

  swap(): void {
    const from = this.form.get('from')!.value;
    const to = this.form.get('to')!.value;
    this.form.patchValue({ from: to, to: from });
  }

  get travelersLabel(): string {
    const a = this.form.get('adults')!.value ?? 1;
    const c = this.form.get('children')!.value ?? 0;
    const total = a + c;
    const parts = [
      `${a} Adult${a === 1 ? '' : 's'}`,
      `${c} Child${c === 1 ? '' : 'ren'}`,
    ];
    return `${total} Traveler${total === 1 ? '' : 's'} · ${parts.join(', ')}`;
  }

  dec(key: 'adults' | 'children'): void {
    const ctrl = this.form.get(key)!;
    const v = Number(ctrl.value ?? 0);
    if (key === 'adults' && v <= 1) return;
    if (key === 'children' && v <= 0) return;
    ctrl.setValue(v - 1);
  }

  inc(key: 'adults' | 'children'): void {
    const ctrl = this.form.get(key)!;
    const v = Number(ctrl.value ?? 0);
    ctrl.setValue(v + 1);
  }

  search(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.value;
    this.searchedFrom = v.from ?? '';
    this.searchedTo = v.to ?? '';

    this.loading = true;
    this.hasSearched = true;
    this.errorMessage = null;
    this.flights = [];

    this.flightService.searchFlights({
      origin: v.from ?? undefined,
      destination: v.to ?? undefined,
      date: v.departureDate ? this.formatDate(v.departureDate) : undefined,
    }).subscribe({
      next: page => {
        this.flights = page.content;
        this.loading = false;
      },
      error: err => {
        console.error('Error searching flights:', err);
        this.errorMessage = 'Could not load flights. Please try again.';
        this.loading = false;
      },
    });
  }

  durationLabel(flight: FlightResponseDTO): string {
    const dep = new Date(flight.departureTime);
    const arr = new Date(flight.arrivalTime);
    const diffMs = arr.getTime() - dep.getTime();
    if (diffMs <= 0) return '—';
    const totalMinutes = Math.floor(diffMs / 60_000);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  onBookFlight(flightId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.bookingError = 'You must be logged in to book a flight.';
      return;
    }
    this.bookingInProgress = true;
    this.confirmedPnr = null;
    this.bookingError = null;
    this.bookingService.createBooking({ flightId }).subscribe({
      next: res => {
        this.confirmedPnr = res.pnr;
        this.bookingInProgress = false;
      },
      error: err => {
        this.bookingError = err.error?.message ?? 'Booking failed. Please try again.';
        this.bookingInProgress = false;
      },
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${mo}-${d}`;
  }
}
