import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FlightResponseDTO, FlightStatus } from '../../../models/flight-response';
import { RouteResponseDTO } from '../../../models/route-response';
import { AircraftResponseDTO } from '../../../models/aircraft-response';
import { FlightService } from '../../../services/flight-service';
import { RouteService } from '../../../services/route-service';
import { AircraftService } from '../../../services/aircraft.service';
import { FlightCreateDTO } from '../../../models/flight-create';
import { FlightUpdateDTO } from '../../../models/flight-update';

export interface FlightFormDialogData {
  flight?: FlightResponseDTO;  // present = edit mode, absent = create mode
}

@Component({
  selector: 'app-flight-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'add_circle' }}</mat-icon>
      {{ isEdit ? 'Edit Flight' : 'New Flight' }}
    </h2>

    <mat-dialog-content>
      <div *ngIf="error" class="error-banner">
        <mat-icon>error_outline</mat-icon> {{ error }}
      </div>

      <form [formGroup]="form" class="flight-form">
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Flight Code</mat-label>
            <input matInput formControlName="code" placeholder="e.g. AM001" />
            <mat-error *ngIf="form.get('code')?.hasError('required')">Flight code is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Route</mat-label>
            <mat-select formControlName="routeId">
              <mat-option *ngFor="let r of routes" [value]="r.id">
                {{ r.originIata }} ({{ r.originCity }}) → {{ r.destIata }} ({{ r.destCity }})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('routeId')?.hasError('required')">Route is required</mat-error>
          </mat-form-field>
        </div>

        <div class="form-row two-col">
          <mat-form-field appearance="outline">
            <mat-label>Departure Date & Time</mat-label>
            <input matInput formControlName="departureTime" type="datetime-local" />
            <mat-error *ngIf="form.get('departureTime')?.hasError('required')">Required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Arrival Date & Time</mat-label>
            <input matInput formControlName="arrivalTime" type="datetime-local" />
            <mat-error *ngIf="form.get('arrivalTime')?.hasError('required')">Required</mat-error>
          </mat-form-field>
        </div>

        <div *ngIf="form.hasError('arrivalBeforeDeparture')" class="validation-error">
          <mat-icon>warning</mat-icon> Arrival must be after departure time.
        </div>

        <div class="form-row two-col">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="SCHEDULED">Scheduled</mat-option>
              <mat-option value="BOARDING">Boarding</mat-option>
              <mat-option value="DELAYED">Delayed</mat-option>
              <mat-option value="CANCELLED">Cancelled</mat-option>
              <mat-option value="IN_AIR">In Air</mat-option>
              <mat-option value="LANDED">Landed</mat-option>
            </mat-select>
            <mat-error *ngIf="form.get('status')?.hasError('required')">Status is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Gate (optional)</mat-label>
            <input matInput formControlName="gate" placeholder="e.g. B12" />
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Aircraft (optional)</mat-label>
            <mat-select formControlName="aircraftId">
              <mat-option [value]="null">— No aircraft assigned —</mat-option>
              <mat-option *ngFor="let a of aircraft" [value]="a.id">
                {{ a.tailNumber }} — {{ a.model }} ({{ a.capacity }} seats)
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button [disabled]="saving" (click)="cancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="saving" (click)="save()">
        <mat-spinner *ngIf="saving" diameter="18" class="btn-spinner"></mat-spinner>
        <span *ngIf="!saving">{{ isEdit ? 'Save Changes' : 'Create Flight' }}</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 { display: flex; align-items: center; gap: 8px; }
    mat-dialog-content { min-width: 520px; }
    .flight-form { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
    .form-row { width: 100%; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    .error-banner {
      display: flex; align-items: center; gap: 8px;
      background: #FFEBEE; color: #C62828; padding: 10px 14px; border-radius: 4px; margin-bottom: 12px;
    }
    .validation-error {
      display: flex; align-items: center; gap: 6px;
      color: #B71C1C; font-size: 13px; margin: -8px 0 8px;
    }
    .btn-spinner { display: inline-block; margin-right: 4px; }
  `]
})
export class FlightFormDialog implements OnInit {
  form!: FormGroup;
  isEdit: boolean;
  saving = false;
  error: string | null = null;
  routes: RouteResponseDTO[] = [];
  aircraft: AircraftResponseDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private routeService: RouteService,
    private aircraftService: AircraftService,
    private dialogRef: MatDialogRef<FlightFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: FlightFormDialogData
  ) {
    this.isEdit = !!data.flight;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadDropdowns();
  }

  private buildForm(): void {
    const f = this.data.flight;
    this.form = this.fb.group(
      {
        code:          [f?.code ?? '',             Validators.required],
        routeId:       [f?.routeId ?? null,        Validators.required],
        departureTime: [f ? this.toLocalInput(f.departureTime) : '', Validators.required],
        arrivalTime:   [f ? this.toLocalInput(f.arrivalTime) : '',   Validators.required],
        status:        [f?.status ?? 'SCHEDULED',  Validators.required],
        gate:          [f?.gate ?? ''],
        aircraftId:    [f?.aircraftId ?? null],
      },
      { validators: this.arrivalAfterDeparture }
    );
  }

  private arrivalAfterDeparture(group: FormGroup) {
    const dep = group.get('departureTime')?.value;
    const arr = group.get('arrivalTime')?.value;
    if (!dep || !arr) return null;
    return new Date(arr) > new Date(dep) ? null : { arrivalBeforeDeparture: true };
  }

  private toLocalInput(isoStr: string): string {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private loadDropdowns(): void {
    this.routeService.getAllRoutes().subscribe({ next: p => this.routes = p.content });
    this.aircraftService.getAll(0, 200, 'model,asc').subscribe({ next: p => this.aircraft = p.content });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving = true;
    this.error = null;
    const v = this.form.value;

    const toIso = (local: string) => new Date(local).toISOString().slice(0, 19);

    if (this.isEdit) {
      const payload: FlightUpdateDTO = {
        code: v.code,
        routeId: v.routeId,
        departureTime: toIso(v.departureTime),
        arrivalTime: toIso(v.arrivalTime),
        status: v.status as FlightStatus,
        gate: v.gate || null,
        aircraftId: v.aircraftId || null,
      };
      this.flightService.updateFlight(this.data.flight!.id, payload).subscribe({
        next: updated => { this.saving = false; this.dialogRef.close(updated); },
        error: err => { this.error = err?.error?.message ?? 'Update failed.'; this.saving = false; }
      });
    } else {
      const payload: FlightCreateDTO = {
        code: v.code,
        routeId: v.routeId,
        departureTime: toIso(v.departureTime),
        arrivalTime: toIso(v.arrivalTime),
        status: v.status as FlightStatus,
        gate: v.gate || null,
        aircraftId: v.aircraftId || null,
      };
      this.flightService.createFlight(payload).subscribe({
        next: created => { this.saving = false; this.dialogRef.close(created); },
        error: err => { this.error = err?.error?.message ?? 'Create failed.'; this.saving = false; }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
