import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-passenger-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './passenger-dashboard.html',
  styleUrls: ['./passenger-dashboard.css'],
})
export class PassengerDashboard {
  authService = inject(AuthService);
}
