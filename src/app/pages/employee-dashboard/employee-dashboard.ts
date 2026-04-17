import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
})
export class EmployeeDashboard {
  authService = inject(AuthService);
}
