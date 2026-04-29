import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlightService } from '../../../services/flight-service';

export interface FlightDeleteConfirmDialogData {
  flightId: number;
  flightCode: string;
}

@Component({
  selector: 'app-flight-delete-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon color="warn">delete_forever</mat-icon>
      Delete Flight
    </h2>

    <mat-dialog-content>
      <p>Are you sure you want to delete flight <strong>{{ data.flightCode }}</strong>?</p>
      <p class="warning-text">
        <mat-icon class="warn-icon">warning</mat-icon>
        This action cannot be undone. All bookings associated with this flight will also be removed.
      </p>
      <div *ngIf="error" class="error-banner">
        <mat-icon>error_outline</mat-icon> {{ error }}
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button [disabled]="deleting" (click)="cancel()">Cancel</button>
      <button mat-flat-button color="warn" [disabled]="deleting" (click)="confirm()">
        <mat-spinner *ngIf="deleting" diameter="18" class="btn-spinner"></mat-spinner>
        <span *ngIf="!deleting">Delete</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; }
    .warning-text {
      display: flex; align-items: flex-start; gap: 6px;
      background: #FFF8E1; color: #F57F17;
      padding: 10px 12px; border-radius: 4px; font-size: 13px;
    }
    .warn-icon { font-size: 18px; width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #FFEBEE; color: #C62828; padding: 10px 14px; border-radius: 4px; margin-top: 8px;
    }
    .btn-spinner { display: inline-block; margin-right: 4px; }
    mat-dialog-content { min-width: 380px; }
  `]
})
export class FlightDeleteConfirmDialog {
  deleting = false;
  error: string | null = null;

  constructor(
    private flightService: FlightService,
    private dialogRef: MatDialogRef<FlightDeleteConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FlightDeleteConfirmDialogData
  ) {}

  confirm(): void {
    this.deleting = true;
    this.error = null;
    this.flightService.deleteFlight(this.data.flightId).subscribe({
      next: () => { this.deleting = false; this.dialogRef.close(true); },
      error: err => {
        this.error = err?.error?.message ?? 'Delete failed. The flight may have active bookings.';
        this.deleting = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
