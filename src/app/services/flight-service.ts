import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FlightCreateDTO } from '../models/flight-create';
import { FlightDetailResponseDTO, FlightResponseDTO, PageResponse } from '../models/flight-response';
import { FlightUpdateDTO } from '../models/flight-update';
import { Observable } from 'rxjs';

export interface FlightFilterQuery {
  code?: string;
  dateFrom?: string;
  dateTo?: string;
  routeId?: number;
  status?: string;
  origin?: string;
  destination?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private readonly url = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  getFlightById(id: number): Observable<FlightDetailResponseDTO> {
    return this.http.get<FlightDetailResponseDTO>(`${this.url}/${id}`);
  }

  getAllFlights(filter: FlightFilterQuery = {}): Observable<PageResponse<FlightResponseDTO>> {
    let params = new HttpParams()
      .set('page', (filter.page ?? 0).toString())
      .set('size', (filter.size ?? 25).toString())
      .set('sort', filter.sort ?? 'departureScheduled,asc');

    if (filter.code)        params = params.set('code',        filter.code);
    if (filter.dateFrom)    params = params.set('dateFrom',    filter.dateFrom);
    if (filter.dateTo)      params = params.set('dateTo',      filter.dateTo);
    if (filter.routeId != null) params = params.set('routeId', filter.routeId.toString());
    if (filter.status)      params = params.set('status',      filter.status);
    if (filter.origin)      params = params.set('origin',      filter.origin);
    if (filter.destination) params = params.set('destination', filter.destination);

    return this.http.get<PageResponse<FlightResponseDTO>>(this.url, { params });
  }

  /** @deprecated Use getAllFlights() with a FlightFilterQuery instead */
  searchFlights(query: {
    routeId?: number;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Observable<PageResponse<FlightResponseDTO>> {
    return this.getAllFlights(query);
  }

  createFlight(payload: FlightCreateDTO): Observable<FlightResponseDTO> {
    return this.http.post<FlightResponseDTO>(this.url, payload);
  }

  updateFlight(id: number, payload: FlightUpdateDTO): Observable<FlightResponseDTO> {
    return this.http.put<FlightResponseDTO>(`${this.url}/${id}`, payload);
  }

  deleteFlight(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
