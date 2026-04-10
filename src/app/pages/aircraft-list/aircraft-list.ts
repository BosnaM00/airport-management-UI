import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AircraftResponseDTO } from '../../models/aircraft-response';
import { AircraftCreateDTO } from '../../models/aircraft-create';
import { AircraftService } from '../../services/aircraft.service';

@Component({
  selector: 'app-aircraft-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './aircraft-list.html',
  styleUrl: './aircraft-list.css',
})
export class AircraftList implements OnInit {
  aircraft: AircraftResponseDTO[] = [];

  page = 0;
  size = 10;
  totalPages = 0;
  sort = 'model,asc';
  loading = false;
  error: string | null = null;

  showForm = false;
  editingId: number | null = null;
  form: AircraftCreateDTO = { tailNumber: '', model: '', capacity: 1 };
  formError: string | null = null;

  constructor(private aircraftService: AircraftService) {}

  ngOnInit(): void {
    this.loadAircraft();
  }

  loadAircraft(): void {
    this.loading = true;
    this.error = null;
    this.aircraftService.getAll(this.page, this.size, this.sort).subscribe({
      next: page => {
        this.aircraft = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: err => {
        this.error = 'Failed to load aircraft.';
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadAircraft();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadAircraft();
    }
  }

  openCreate(): void {
    this.editingId = null;
    this.form = { tailNumber: '', model: '', capacity: 1 };
    this.formError = null;
    this.showForm = true;
  }

  openEdit(a: AircraftResponseDTO): void {
    this.editingId = a.id;
    this.form = { tailNumber: a.tailNumber, model: a.model, capacity: a.capacity, seatMapRef: a.seatMapRef ?? undefined, status: a.status ?? undefined };
    this.formError = null;
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.formError = null;
  }

  saveForm(): void {
    this.formError = null;
    if (this.editingId !== null) {
      this.aircraftService.update(this.editingId, this.form).subscribe({
        next: () => { this.showForm = false; this.loadAircraft(); },
        error: err => { this.formError = err?.error?.message ?? 'Update failed.'; }
      });
    } else {
      this.aircraftService.create(this.form).subscribe({
        next: () => { this.showForm = false; this.loadAircraft(); },
        error: err => { this.formError = err?.error?.message ?? 'Create failed.'; }
      });
    }
  }

  deleteAircraft(id: number): void {
    if (!confirm('Delete this aircraft?')) return;
    this.aircraftService.delete(id).subscribe({
      next: () => this.loadAircraft(),
      error: () => alert('Delete failed. The aircraft may be assigned to a flight.')
    });
  }
}
