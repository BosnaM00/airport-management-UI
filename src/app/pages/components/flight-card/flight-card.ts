import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './flight-card.html',
  styleUrls: ['./flight-card.css'],
})
export class FlightCardComponent {
  @Input() imageUrl: string = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80';
  @Input() from: string = 'Timisoara';
  @Input() to: string = 'Milan';
  @Input() price: number = 129;
  @Input() currency: string = '€';
  @Input() isDirect: boolean = true;
  @Input() stops: number = 0;
  @Input() airline: string = 'SkyJet Airlines';
  @Input() duration: string = '2h 15m';
  @Input() flightId: number | null = null;

  @Output() bookFlight = new EventEmitter<number>();

  get stopLabel(): string {
    if (this.isDirect) return 'Direct';
    return this.stops === 1 ? '1 stop' : `${this.stops} stops`;
  }

  onBook(): void {
    if (this.flightId != null) {
      this.bookFlight.emit(this.flightId);
    }
  }
}
