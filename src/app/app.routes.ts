import { Routes } from '@angular/router';
import { AirportList } from './pages/airport-list/airport-list';
import { BookingList } from './pages/booking-list/booking-list';
import { FlightList } from './pages/flight-list/flight-list';
import { Register } from './pages/register/register';
import { SearchFlights } from './pages/search-flights/search-flights';
import { AircraftList } from './pages/aircraft-list/aircraft-list';
import { PassengerDashboard } from './pages/passenger-dashboard/passenger-dashboard';
import { EmployeeDashboard } from './pages/employee-dashboard/employee-dashboard';
import { PassengerProfile } from './pages/passenger-profile/passenger-profile';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'search-flights', component: SearchFlights },

  { path: 'airports', component: AirportList },
  { path: 'bookings', component: BookingList, canActivate: [authGuard] },
  { path: 'flights', component: FlightList, canActivate: [authGuard, roleGuard('EMPLOYEE')] },
  { path: 'aircraft', component: AircraftList, canActivate: [authGuard, roleGuard('EMPLOYEE')] },

  { path: 'passenger-dashboard', component: PassengerDashboard, canActivate: [authGuard, roleGuard('PASSENGER')] },
  { path: 'employee-dashboard', component: EmployeeDashboard, canActivate: [authGuard, roleGuard('EMPLOYEE')] },
  { path: 'profile', component: PassengerProfile, canActivate: [authGuard, roleGuard('PASSENGER')] },

  { path: 'register', component: Register },

  { path: '', redirectTo: 'search-flights', pathMatch: 'full' },
  { path: '**', redirectTo: 'search-flights' },
];
