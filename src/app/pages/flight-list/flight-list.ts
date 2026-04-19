import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

// Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

// App
import { FlightResponseDTO, FlightStatus } from '../../models/flight-response';
import { FlightService, FlightFilterQuery } from '../../services/flight-service';
import { RouteResponseDTO } from '../../models/route-response';
import { RouteService } from '../../services/route-service';
import { FlightStatusBadge, FLIGHT_STATUS_CONFIG } from '../../components/flight-status-badge/flight-status-badge';
import { FlightDetailDialog } from './dialogs/flight-detail-dialog';
import { FlightStatusUpdateDialog } from './dialogs/flight-status-update-dialog';
import { FlightFormDialog } from './dialogs/flight-form-dialog';
import { FlightDeleteConfirmDialog } from './dialogs/flight-delete-confirm-dialog';
import { FlightUpdateDTO } from '../../models/flight-update';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatTooltipModule,
    MatProgressBarModule, MatDialogModule,
    MatDatepickerModule, MatNativeDateModule,
    MatChipsModule, MatDividerModule, MatCardModule,
    FlightStatusBadge
  ],
  templateUrl: './flight-list.html',
  styleUrl: './flight-list.css',
})
export class FlightList implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Table
  displayedColumns = ['code', 'route', 'departure', 'arrival', 'duration', 'gate', 'status', 'actions'];
  dataSource = new MatTableDataSource<FlightResponseDTO>([]);
  totalElements = 0;

  // Pagination
  pageIndex = 0;
  pageSize = 25;
  pageSizeOptions = [10, 25, 50, 100];

  // Sorting
  sortField = 'departureScheduled';
  sortDir: 'asc' | 'desc' = 'asc';

  // State
  loading = false;
  error: string | null = null;

  // Filters form
  filterForm!: FormGroup;
  allStatuses: FlightStatus[] = ['SCHEDULED', 'BOARDING', 'DELAYED', 'CANCELLED', 'IN_AIR', 'LANDED'];
  statusConfig = FLIGHT_STATUS_CONFIG;
  routes: RouteResponseDTO[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private routeService: RouteService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buildFilterForm();
    this.loadRoutes();
    this.restoreStateFromUrl();
    this.watchFilterChanges();
    this.loadFlights();
  }

  ngAfterViewInit(): void {
    // Sort change triggers reload
    this.sort.sortChange.pipe(takeUntil(this.destroy$)).subscribe((s: Sort) => {
      this.sortField = s.active;
      this.sortDir = (s.direction as 'asc' | 'desc') || 'asc';
      this.pageIndex = 0;
      this.persistStateToUrl();
      this.loadFlights();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  private buildFilterForm(): void {
    this.filterForm = this.fb.group({
      code:        [''],
      status:      [[]],
      origin:      [''],
      destination: [''],
      dateFrom:    [null],
      dateTo:      [null],
      routeId:     [null],
    });
  }

  private watchFilterChanges(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.persistStateToUrl();
        this.loadFlights();
      });
  }

  clearFilters(): void {
    this.filterForm.reset({ code: '', status: [], origin: '', destination: '', dateFrom: null, dateTo: null, routeId: null });
    this.pageIndex = 0;
    this.persistStateToUrl();
    this.loadFlights();
  }

  get hasActiveFilters(): boolean {
    const v = this.filterForm.value;
    return !!(v.code || (v.status?.length) || v.origin || v.destination || v.dateFrom || v.dateTo || v.routeId);
  }

  // ── Data loading ─────────────────────────────────────────────────────────

  loadFlights(): void {
    this.loading = true;
    this.error = null;

    const v = this.filterForm.value;
    const filter: FlightFilterQuery = {
      page: this.pageIndex,
      size: this.pageSize,
      sort: `${this.sortField},${this.sortDir}`,
    };

    if (v.code)        filter.code        = v.code.trim();
    if (v.status?.length === 1) filter.status = v.status[0];
    if (v.origin)      filter.origin      = v.origin.trim();
    if (v.destination) filter.destination = v.destination.trim();
    if (v.routeId)     filter.routeId     = v.routeId;
    if (v.dateFrom)    filter.dateFrom    = this.toIsoStart(v.dateFrom);
    if (v.dateTo)      filter.dateTo      = this.toIsoEnd(v.dateTo);

    this.flightService.getAllFlights(filter).subscribe({
      next: page => {
        this.dataSource.data = page.content;
        this.totalElements   = page.totalElements;
        this.loading = false;
      },
      error: () => {
        this.error   = 'Failed to load flights. Please check your connection and try again.';
        this.loading = false;
      }
    });
  }

  private loadRoutes(): void {
    this.routeService.getAllRoutes().subscribe({ next: p => this.routes = p.content });
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize  = event.pageSize;
    this.persistStateToUrl();
    this.loadFlights();
  }

  // ── URL state sync ────────────────────────────────────────────────────────

  private restoreStateFromUrl(): void {
    const p = this.route.snapshot.queryParams;
    if (p['page'])  this.pageIndex = +p['page'];
    if (p['size'])  this.pageSize  = +p['size'];
    if (p['sort'])  { const [f, d] = p['sort'].split(','); this.sortField = f; this.sortDir = d as 'asc'|'desc'; }
    if (p['code'] || p['status'] || p['origin'] || p['destination'] || p['routeId'] || p['dateFrom'] || p['dateTo']) {
      this.filterForm.patchValue({
        code:        p['code']        ?? '',
        status:      p['status'] ? [p['status']] : [],
        origin:      p['origin']      ?? '',
        destination: p['destination'] ?? '',
        routeId:     p['routeId']     ? +p['routeId'] : null,
        dateFrom:    p['dateFrom']    ? new Date(p['dateFrom']) : null,
        dateTo:      p['dateTo']      ? new Date(p['dateTo']) : null,
      }, { emitEvent: false });
    }
  }

  private persistStateToUrl(): void {
    const v = this.filterForm.value;
    const queryParams: Record<string, any> = {
      page: this.pageIndex || null,
      size: this.pageSize !== 25 ? this.pageSize : null,
      sort: `${this.sortField},${this.sortDir}`,
      code:        v.code        || null,
      status:      v.status?.[0] || null,
      origin:      v.origin      || null,
      destination: v.destination || null,
      routeId:     v.routeId     || null,
      dateFrom:    v.dateFrom ? this.toIsoStart(v.dateFrom) : null,
      dateTo:      v.dateTo   ? this.toIsoEnd(v.dateTo)     : null,
    };
    this.router.navigate([], { queryParams, replaceUrl: true, relativeTo: this.route });
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  openDetail(flight: FlightResponseDTO): void {
    this.dialog.open(FlightDetailDialog, {
      data: { flightId: flight.id },
      maxWidth: '640px',
      width: '100%'
    });
  }

  openCreate(): void {
    this.dialog.open(FlightFormDialog, { data: {}, width: '600px', maxWidth: '100%' })
      .afterClosed().subscribe(result => { if (result) this.loadFlights(); });
  }

  openEdit(flight: FlightResponseDTO, event: Event): void {
    event.stopPropagation();
    this.dialog.open(FlightFormDialog, { data: { flight }, width: '600px', maxWidth: '100%' })
      .afterClosed().subscribe(result => {
        if (result) {
          const idx = this.dataSource.data.findIndex(f => f.id === result.id);
          if (idx > -1) {
            const updated = [...this.dataSource.data];
            updated[idx] = result;
            this.dataSource.data = updated;
          }
        }
      });
  }

  openStatusUpdate(flight: FlightResponseDTO, event: Event): void {
    event.stopPropagation();
    const currentPayload: FlightUpdateDTO = {
      code:          flight.code,
      routeId:       flight.routeId,
      departureTime: flight.departureTime,
      arrivalTime:   flight.arrivalTime,
      status:        flight.status,
      gate:          flight.gate,
      aircraftId:    flight.aircraftId,
    };
    this.dialog.open(FlightStatusUpdateDialog, {
      data: { flightId: flight.id, flightCode: flight.code, currentStatus: flight.status, currentPayload },
      width: '420px'
    }).afterClosed().subscribe(result => {
      if (result) {
        const idx = this.dataSource.data.findIndex(f => f.id === result.id);
        if (idx > -1) {
          const updated = [...this.dataSource.data];
          updated[idx] = result;
          this.dataSource.data = updated;
        }
      }
    });
  }

  openDelete(flight: FlightResponseDTO, event: Event): void {
    event.stopPropagation();
    this.dialog.open(FlightDeleteConfirmDialog, {
      data: { flightId: flight.id, flightCode: flight.code },
      width: '420px'
    }).afterClosed().subscribe(deleted => {
      if (deleted) {
        this.dataSource.data = this.dataSource.data.filter(f => f.id !== flight.id);
        this.totalElements--;
        if (this.dataSource.data.length === 0 && this.pageIndex > 0) {
          this.pageIndex--;
          this.loadFlights();
        }
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  getDuration(departure: string, arrival: string): string {
    const mins = Math.round((new Date(arrival).getTime() - new Date(departure).getTime()) / 60000);
    if (mins < 0) return '—';
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  private toIsoStart(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 19);
  }

  private toIsoEnd(date: Date): string {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d.toISOString().slice(0, 19);
  }

  removeStatusChip(status: FlightStatus): void {
    const current: FlightStatus[] = this.filterForm.get('status')?.value ?? [];
    this.filterForm.patchValue({ status: current.filter(s => s !== status) });
  }
}
