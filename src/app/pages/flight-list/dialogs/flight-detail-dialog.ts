import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FlightDetailResponseDTO } from '../../../models/flight-response';
import { FlightService } from '../../../services/flight-service';
import { FlightStatusBadge } from '../../../components/flight-status-badge/flight-status-badge';

export interface FlightDetailDialogData {
  flightId: number;
}

@Component({
  selector: 'app-flight-detail-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTableModule, MatDividerModule,
    MatChipsModule, FlightStatusBadge
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title>
        <mat-icon>flight</mat-icon>
        Flight Details
      </h2>
      <button mat-icon-button (click)="close()" aria-label="Close dialog">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content>
      <div *ngIf="loading" class="loading-center">
        <mat-spinner diameter="48"></mat-spinner>
      </div>

      <div *ngIf="error" class="error-banner">
        <mat-icon>error_outline</mat-icon>
        <span>{{ error }}</span>
        <button mat-button color="primary" (click)="load()">Retry</button>
      </div>

      <ng-container *ngIf="flight && !loading">
        <!-- Flight header -->
        <div class="flight-header">
          <div class="flight-code">{{ flight.code }}</div>
          <app-flight-status-badge [status]="flight.status"></app-flight-status-badge>
        </div>

        <div class="route-row">
          <div class="airport-block">
            <span class="iata">{{ flight.originIata }}</span>
            <span class="city">{{ flight.originCity }}</span>
            <span class="time">{{ flight.departureTime | date:'dd MMM yyyy HH:mm' }}</span>
          </div>
          <div class="route-arrow">
            <mat-icon>arrow_forward</mat-icon>
          </div>
          <div class="airport-block">
            <span class="iata">{{ flight.destIata }}</span>
            <span class="city">{{ flight.destCity }}</span>
            <span class="time">{{ flight.arrivalTime | date:'dd MMM yyyy HH:mm' }}</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Details grid -->
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Gate</span>
            <span class="detail-value">{{ flight.gate || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Aircraft</span>
            <span class="detail-value">{{ flight.aircraftModel || '—' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Duration</span>
            <span class="detail-value">{{ getDuration() }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Route ID</span>
            <span class="detail-value">#{{ flight.routeId }}</span>
          </div>
        </div>

        <mat-divider></mat-divider>

        <!-- Passenger list -->
        <div class="section-title">
          <mat-icon>people</mat-icon>
          Passengers ({{ flight.passengers.length }})
        </div>

        <div *ngIf="flight.passengers.length === 0" class="no-passengers">
          No passengers booked on this flight.
        </div>

        <table *ngIf="flight.passengers.length > 0" mat-table [dataSource]="flight.passengers" class="passengers-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let p">{{ p.email }}</td>
          </ng-container>
          <ng-container matColumnDef="pnr">
            <th mat-header-cell *matHeaderCellDef>PNR</th>
            <td mat-cell *matCellDef="let p">{{ p.pnr }}</td>
          </ng-container>
          <ng-container matColumnDef="nationality">
            <th mat-header-cell *matHeaderCellDef>Nationality</th>
            <td mat-cell *matCellDef="let p">{{ p.nationality }}</td>
          </ng-container>
          <ng-container matColumnDef="bookingStatus">
            <th mat-header-cell *matHeaderCellDef>Booking Status</th>
            <td mat-cell *matCellDef="let p">
              <span class="booking-chip" [class]="'booking-' + p.bookingStatus.toLowerCase()">
                {{ p.bookingStatus }}
              </span>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="passengerColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: passengerColumns;"></tr>
        </table>
      </ng-container>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="close()">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px 0;
    }
    .dialog-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 20px;
    }
    .loading-center { display: flex; justify-content: center; padding: 40px; }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #FFEBEE; color: #C62828; padding: 12px 16px; border-radius: 4px; margin-bottom: 16px;
    }
    .flight-header {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
    }
    .flight-code { font-size: 28px; font-weight: 700; color: #1a237e; }
    .route-row {
      display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
    }
    .airport-block {
      display: flex; flex-direction: column; align-items: center; gap: 2px;
    }
    .iata { font-size: 24px; font-weight: 700; color: #283593; }
    .city { font-size: 12px; color: #666; }
    .time { font-size: 13px; font-weight: 500; }
    .route-arrow { flex: 1; display: flex; justify-content: center; color: #90a4ae; }
    .details-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 12px; margin: 16px 0;
    }
    .detail-item { display: flex; flex-direction: column; gap: 2px; }
    .detail-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-value { font-size: 15px; font-weight: 500; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 15px; font-weight: 600; color: #37474f; margin: 16px 0 8px;
    }
    .no-passengers { color: #9e9e9e; font-style: italic; padding: 8px 0; }
    .passengers-table { width: 100%; }
    .booking-chip {
      padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
    }
    .booking-confirmed { background: #E8F5E9; color: #1B5E20; }
    .booking-cancelled { background: #FFEBEE; color: #B71C1C; }
    .booking-pending   { background: #FFF3E0; color: #E65100; }
    mat-dialog-content { max-height: 70vh; min-width: 520px; }
  `]
})
export class FlightDetailDialog implements OnInit {
  flight: FlightDetailResponseDTO | null = null;
  loading = false;
  error: string | null = null;
  passengerColumns = ['name', 'pnr', 'nationality', 'bookingStatus'];

  constructor(
    private flightService: FlightService,
    private dialogRef: MatDialogRef<FlightDetailDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FlightDetailDialogData
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.flightService.getFlightById(this.data.flightId).subscribe({
      next: f => { this.flight = f; this.loading = false; },
      error: () => { this.error = 'Could not load flight details. Please try again.'; this.loading = false; }
    });
  }

  getDuration(): string {
    if (!this.flight) return '—';
    const dep = new Date(this.flight.departureTime);
    const arr = new Date(this.flight.arrivalTime);
    const mins = Math.round((arr.getTime() - dep.getTime()) / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }

  close(): void {
    this.dialogRef.close();
  }
}
