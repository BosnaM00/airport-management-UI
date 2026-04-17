import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-passenger-profile',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './passenger-profile.html',
  styleUrls: ['./passenger-profile.css'],
})
export class PassengerProfile {}
