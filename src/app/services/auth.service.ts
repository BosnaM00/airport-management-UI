import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/auth';

const TOKEN_KEY = 'auth_token';
const ROLES_KEY = 'auth_roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';

  isLoggedIn = signal(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => this.saveToken(res.token, res.roles ?? []))
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload).pipe(
      tap(res => this.saveToken(res.token, res.roles ?? []))
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLES_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/search-flights']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getRoles(): string[] {
    const stored = localStorage.getItem(ROLES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  getUserRole(): 'PASSENGER' | 'EMPLOYEE' | null {
    if (this.hasRole('EMPLOYEE')) return 'EMPLOYEE';
    if (this.hasRole('PASSENGER')) return 'PASSENGER';
    return null;
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  private saveToken(token: string, roles: string[]): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    this.isLoggedIn.set(true);
  }
}
