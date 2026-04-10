import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AircraftResponseDTO } from '../models/aircraft-response';
import { AircraftCreateDTO } from '../models/aircraft-create';

@Injectable({ providedIn: 'root' })
export class AircraftService {
  private readonly url = 'http://localhost:8080/api/aircraft';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 10, sort: string = 'model,asc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<any>(this.url, { params });
  }

  getById(id: number): Observable<AircraftResponseDTO> {
    return this.http.get<AircraftResponseDTO>(`${this.url}/${id}`);
  }

  create(payload: AircraftCreateDTO): Observable<AircraftResponseDTO> {
    return this.http.post<AircraftResponseDTO>(this.url, payload);
  }

  update(id: number, payload: AircraftCreateDTO): Observable<AircraftResponseDTO> {
    return this.http.put<AircraftResponseDTO>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
