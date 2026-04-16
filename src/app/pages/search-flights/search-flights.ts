import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap, EMPTY } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FlightCardComponent } from '../components/flight-card/flight-card';
import { FooterComponent } from '../components/footer/footer';
import { FlightService } from '../../services/flight-service';
import { BookingService } from '../../services/booking-service';
import { AirportService } from '../../services/airport-service';
import { RouteService } from '../../services/route-service';
import { FlightResponseDTO } from '../../models/flight-response';
import { AirportResponseDTO } from '../../models/airport-response';
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
    MatAutocompleteModule,
    FlightCardComponent,
    FooterComponent,
  ],
  templateUrl: './search-flights.html',
  styleUrls: ['./search-flights.css'],
})
export class SearchFlights implements OnInit {
  private fb = inject(FormBuilder);
  private flightService = inject(FlightService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private airportService = inject(AirportService);
  private routeService = inject(RouteService);

  allAirports: AirportResponseDTO[] = [];
  filteredFromAirports: AirportResponseDTO[] = [];
  filteredToAirports: AirportResponseDTO[] = [];
  airportsLoading = false;

  confirmedPnr: string | null = null;
  bookingError: string | null = null;
  bookingInProgress = false;

  form = this.fb.group({
    from: [null as AirportResponseDTO | null, [Validators.required]],
    to: [null as AirportResponseDTO | null, [Validators.required]],
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

  ngOnInit(): void {
    this.airportsLoading = true;
    this.airportService.getAllAirports(0, 1000, 'name,asc').subscribe({
      next: page => {
        this.allAirports = page.content;
        this.filteredFromAirports = page.content;
        this.filteredToAirports = page.content;
        this.airportsLoading = false;
      },
      error: () => { this.airportsLoading = false; }
    });
  }

  displayAirport(airport: AirportResponseDTO | string | null): string {
    if (!airport) return '';
    if (typeof airport === 'string') return airport;
    return `${airport.iata} — ${airport.city}`;
  }

  filterFromAirports(value: string | AirportResponseDTO): void {
    this.filteredFromAirports = this._matchAirports(value);
  }

  filterToAirports(value: string | AirportResponseDTO): void {
    this.filteredToAirports = this._matchAirports(value);
  }

  private _matchAirports(value: string | AirportResponseDTO): AirportResponseDTO[] {
    if (typeof value === 'object' && value !== null) return this.allAirports;
    const filter = (value ?? '').toLowerCase().trim();
    if (!filter) return this.allAirports;
    return this.allAirports.filter(a =>
      a.name.toLowerCase().includes(filter) ||
      a.city.toLowerCase().includes(filter) ||
      a.country.toLowerCase().includes(filter) ||
      a.iata.toLowerCase().includes(filter)
    );
  }

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

    const fromAirport = this.form.value.from;
    const toAirport   = this.form.value.to;
    const depDate     = this.form.value.departureDate as Date;

    if (typeof fromAirport !== 'object' || !fromAirport?.id ||
        typeof toAirport !== 'object'   || !toAirport?.id) {
      this.errorMessage = 'Please select an airport from the dropdown list.';
      this.loading = false;
      this.hasSearched = true;
      return;
    }

    this.searchedFrom = (fromAirport as AirportResponseDTO).iata;
    this.searchedTo   = (toAirport as AirportResponseDTO).iata;
    this.loading      = true;
    this.hasSearched  = true;
    this.errorMessage = null;
    this.flights      = [];

    const dateFrom = `${this.formatDate(depDate)}T00:00:00`;
    const nextDay  = new Date(depDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const dateTo = `${this.formatDate(nextDay)}T00:00:00`;

    this.routeService.findRoute((fromAirport as AirportResponseDTO).id, (toAirport as AirportResponseDTO).id).pipe(
      switchMap(routePage => {
        if (routePage.content.length === 0) {
          this.errorMessage = 'No route found between selected airports.';
          this.loading = false;
          return EMPTY;
        }
        return this.flightService.searchFlights({
          routeId: routePage.content[0].id,
          dateFrom,
          dateTo,
        });
      })
    ).subscribe({
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
