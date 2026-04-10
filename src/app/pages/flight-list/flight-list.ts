import { Component, OnInit } from '@angular/core';
import { FlightResponseDTO } from '../../models/flight-response';
import { FlightService } from '../../services/flight-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-list.html',
  styleUrl: './flight-list.css',
})
export class FlightList implements OnInit{
  flights: FlightResponseDTO[] = [];

  page = 0;
  size = 5;
  totalPages = 0;
  sort = 'departureTime,asc';
  loading = false;

  constructor(private flightService: FlightService){}

  ngOnInit(): void{this.loadFlights()}

  loadFlights(){
    this.loading = true;
    this.flightService.getAllFlights(this.page, this.size, this.sort).subscribe({
      next: page => {
        this.flights = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
        },
      error: err => {
        console.error('Error while loading the flights!', err);
        this.loading = false;
        }
      });
    }

  nextPage(){
      if (this.page<this.totalPages-1){
        this.page++;
        this.loadFlights();
        }
      }

    previousPage(){
      if (this.page>0){
        this.page--;
        this.loadFlights();
        }
      }

    sortTable(){
      this.sort = this.sort === 'departureTime,asc' ? 'departureTime,desc' : 'departureTime,asc';
      this.loadFlights();
      }


}
