import { Component, OnInit } from '@angular/core';
import { AirportResponseDTO } from '../../models/airport-response';
import { AirportService } from '../../services/airport-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-airport-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './airport-list.html',
  styleUrl: './airport-list.css',
})
export class AirportList implements OnInit{
  airports: AirportResponseDTO[] = [];

  page = 0;
  size = 5;
  totalPages = 0;
  sort = 'name,asc';
  loading = false;


  constructor(private airportService: AirportService){}

  ngOnInit(): void{this.loadAirports()}

  loadAirports(){
    this.loading = true;
    this.airportService.getAllAirports(this.page, this.size, this.sort).subscribe({
      next: page => {
        this.airports = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
        },
      error: err => {
        console.error('Error while loading the airports!', err);
        this.loading = false;
        }
      });
    }

  nextPage(){
    if (this.page<this.totalPages-1){
      this.page++;
      this.loadAirports();
      }
    }

  previousPage(){
    if (this.page>0){
      this.page--;
      this.loadAirports();
      }
    }

  sortTable(){
    this.sort = this.sort === 'name,asc' ? 'name,desc' : 'name,asc';
    this.loadAirports();
    }
}
