import { Routes } from '@angular/router';
import { AirportList } from './pages/airport-list/airport-list';
import { BookingList } from './pages/booking-list/booking-list';
import { FlightList } from './pages/flight-list/flight-list';
import { Register } from './pages/register/register';
import { SearchFlights } from './pages/search-flights/search-flights';
import { AircraftList } from './pages/aircraft-list/aircraft-list';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'search-flights', component: SearchFlights },

  { path: 'airports', component: AirportList },
  { path: 'bookings', component: BookingList, canActivate: [authGuard] },
  { path: 'flights', component: FlightList, canActivate: [authGuard] },
  { path: 'aircraft', component: AircraftList, canActivate: [authGuard] },

  { path: 'register', component: Register },

  { path: '', redirectTo: 'search-flights', pathMatch: 'full' },
  { path: '**', redirectTo: 'search-flights' },
];
