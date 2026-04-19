import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlightStatus } from '../../models/flight-response';

export interface StatusConfig {
  label: string;
  icon: string;
  colorClass: string;
}

export const FLIGHT_STATUS_CONFIG: Record<FlightStatus, StatusConfig> = {
  SCHEDULED:  { label: 'Scheduled',  icon: 'schedule',                     colorClass: 'status-scheduled'  },
  BOARDING:   { label: 'Boarding',   icon: 'airline_seat_recline_normal',   colorClass: 'status-boarding'   },
  DELAYED:    { label: 'Delayed',    icon: 'hourglass_bottom',              colorClass: 'status-delayed'    },
  CANCELLED:  { label: 'Cancelled',  icon: 'cancel',                        colorClass: 'status-cancelled'  },
  IN_AIR:     { label: 'In Air',     icon: 'flight',                        colorClass: 'status-in-air'     },
  LANDED:     { label: 'Landed',     icon: 'flight_land',                   colorClass: 'status-landed'     },
};

@Component({
  selector: 'app-flight-status-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <span
      class="status-badge {{ config.colorClass }}"
      [matTooltip]="config.label"
      [attr.aria-label]="'Flight status: ' + config.label">
      <mat-icon class="status-icon">{{ config.icon }}</mat-icon>
      <span class="status-label">{{ config.label }}</span>
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
      white-space: nowrap;
    }
    .status-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      line-height: 14px;
    }
    .status-scheduled  { background: #E3F2FD; color: #1565C0; }
    .status-boarding   { background: #FFF3E0; color: #E65100; }
    .status-delayed    { background: #FBE9E7; color: #BF360C; }
    .status-cancelled  { background: #FFEBEE; color: #B71C1C; }
    .status-in-air     { background: #E8F5E9; color: #1B5E20; }
    .status-landed     { background: #F5F5F5; color: #424242; }
  `]
})
export class FlightStatusBadge {
  @Input({ required: true }) status!: FlightStatus;

  get config(): StatusConfig {
    return FLIGHT_STATUS_CONFIG[this.status] ?? { label: this.status, icon: 'help', colorClass: 'status-landed' };
  }
}
