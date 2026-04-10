import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AirportCreateDTO } from '../models/airport-create';
import { AirportResponseDTO } from '../models/airport-response';
import { AirportUpdateDTO } from '../models/airport-update';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirportService {
  constructor(private http: HttpClient){}

  private url = `http://localhost:8080/api/airports`;

  getAirportById(id: number): Observable<AirportResponseDTO> {
    return this.http.get<AirportResponseDTO>(`${this.url}/${id}`);
    }

  getAllAirports(page: number = 0,
                     size: number = 5,
                     sort: string = 'name,asc'
                     ): Observable<any>{
    let params = new HttpParams()
          .set('page', page.toString())
          .set('size', size.toString())
          .set('sort', sort);

    return this.http.get<any>(this.url, { params });
    }

  createAirport(payload: AirportCreateDTO): Observable<AirportResponseDTO>{
    return this.http.post<AirportResponseDTO>(this.url, payload);
    }

  updateAirport(id: number, payload: AirportUpdateDTO): Observable<AirportResponseDTO>{
    return this.http.put<AirportResponseDTO>(`${this.url}/${id}`, payload);
    }

  deleteAirport(id: number): Observable<void>{
      return this.http.delete<void>(`${this.url}/${id}`);
    }

}
