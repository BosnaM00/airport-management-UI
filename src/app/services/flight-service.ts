import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlightCreateDTO } from '../models/flight-create';
import { FlightResponseDTO, PageResponse } from '../models/flight-response';
import { FlightUpdateDTO } from '../models/flight-update';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {

  constructor(private http: HttpClient){}

  private url = `http://localhost:8080/api/flights`;

  getFlightById(id: number): Observable<FlightResponseDTO> {
    return this.http.get<FlightResponseDTO>(`${this.url}/${id}`);
    }

  getAllFlights(page: number = 0,
                       size: number = 10,
                       sort: string = 'name,asc'
                       ): Observable<any>{
      let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString())
            .set('sort', sort);

      return this.http.get<any>(this.url, { params });
      }

  searchFlights(query: {
    routeId?: number;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Observable<PageResponse<FlightResponseDTO>> {
    let params = new HttpParams();
    if (query.routeId  != null) params = params.set('routeId',  query.routeId.toString());
    if (query.dateFrom)         params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo)           params = params.set('dateTo',   query.dateTo);
    if (query.status)           params = params.set('status',   query.status);
    params = params.set('page', (query.page ?? 0).toString());
    params = params.set('size', (query.size ?? 20).toString());
    return this.http.get<PageResponse<FlightResponseDTO>>(this.url, { params });
  }

  createFlight(payload: FlightCreateDTO): Observable<FlightResponseDTO>{
      return this.http.post<FlightResponseDTO>(this.url, payload);
      }

  updateFlight(id: number, payload: FlightUpdateDTO): Observable<FlightResponseDTO>{
      return this.http.put<FlightResponseDTO>(`${this.url}/${id}`, payload);
      }

    deleteFlight(id: number): Observable<void>{
        return this.http.delete<void>(`${this.url}/${id}`);
      }


}
