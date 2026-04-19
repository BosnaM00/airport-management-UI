import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouteResponseDTO } from '../models/route-response';
import { PageResponse } from '../models/airport-response';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private url = 'http://localhost:8080/api/routes';

  constructor(private http: HttpClient) {}

  findRoute(originId: number, destId: number): Observable<PageResponse<RouteResponseDTO>> {
    const params = new HttpParams()
      .set('originId', originId.toString())
      .set('destId', destId.toString())
      .set('size', '1');
    return this.http.get<PageResponse<RouteResponseDTO>>(this.url, { params });
  }

  getAllRoutes(size: number = 200): Observable<PageResponse<RouteResponseDTO>> {
    const params = new HttpParams()
      .set('size', size.toString())
      .set('sort', 'id,asc');
    return this.http.get<PageResponse<RouteResponseDTO>>(this.url, { params });
  }
}
