import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FlightStatus } from '../../../models/flight-response';
import { FlightStatusBadge, FLIGHT_STATUS_CONFIG } from '../../../components/flight-status-badge/flight-status-badge';
import { FlightService } from '../../../services/flight-service';
import { FlightUpdateDTO } from '../../../models/flight-update';

export interface StatusUpdateDialogData {
  flightId: number;
  flightCode: string;
  currentStatus: FlightStatus;
  // current values needed to pass full DTO to update endpoint
  currentPayload: FlightUpdateDTO;
}

@Component({
  selector: 'app-flight-status-update-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatDialogModule, MatButtonModule,
    MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatIconModule, FlightStatusBadge
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>edit_note</mat-icon>
      Update Flight Status — {{ data.flightCode }}
    </h2>

    <mat-dialog-content>
      <p class="current-label">Current status:</p>
      <app-flight-status-badge [status]="data.currentStatus"></app-flight-status-badge>

      <mat-form-field appearance="outline" class="status-select">
        <mat-label>New Status</mat-label>
        <mat-select [(ngModel)]="selectedStatus">
          <mat-option *ngFor="let s of allStatuses" [value]="s">
            {{ statusConfig[s].label }}
          </mat-option>
        </mat-select>
      </mat-form-field>

      <div *ngIf="error" class="error-banner">
        <mat-icon>error_outline</mat-icon> {{ error }}
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button [disabled]="saving" (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary"
              [disabled]="saving || selectedStatus === data.currentStatus"
              (click)="save()">
        <mat-spinner *ngIf="saving" diameter="18" class="btn-spinner"></mat-spinner>
        <span *ngIf="!saving">Update</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; }
    .current-label { color: #666; font-size: 13px; margin-bottom: 6px; }
    .status-select { width: 100%; margin-top: 20px; }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #FFEBEE; color: #C62828; padding: 10px 14px; border-radius: 4px; margin-top: 8px;
    }
    .btn-spinner { display: inline-block; margin-right: 4px; }
    mat-dialog-content { min-width: 360px; }
  `]
})
export class FlightStatusUpdateDialog {
  allStatuses: FlightStatus[] = ['SCHEDULED', 'BOARDING', 'DELAYED', 'CANCELLED', 'IN_AIR', 'LANDED'];
  statusConfig = FLIGHT_STATUS_CONFIG;
  selectedStatus: FlightStatus;
  saving = false;
  error: string | null = null;

  constructor(
    private flightService: FlightService,
    private dialogRef: MatDialogRef<FlightStatusUpdateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: StatusUpdateDialogData
  ) {
    this.selectedStatus = data.currentStatus;
  }

  save(): void {
    this.saving = true;
    this.error = null;
    const payload: FlightUpdateDTO = { ...this.data.currentPayload, status: this.selectedStatus };
    this.flightService.updateFlight(this.data.flightId, payload).subscribe({
      next: updated => {
        this.saving = false;
        this.dialogRef.close(updated);
      },
      error: err => {
        this.error = err?.error?.message ?? 'Failed to update status. Please try again.';
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
