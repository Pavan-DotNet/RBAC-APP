
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Update this with your backend API URL
  private jwtHelper = new JwtHelperService();
  private userRoles = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
    this.loadUserRoles();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.setSession(response);
          this.loadUserRoles();
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, email, password });
  }

  private setSession(authResult: any) {
    localStorage.setItem('id_token', authResult.token);
  }

  logout() {
    localStorage.removeItem('id_token');
    this.userRoles.next([]);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  public isAdmin(): boolean {
    return this.userRoles.value.includes('Admin');
  }

  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  public loadUserRoles() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || [];
      this.userRoles.next(Array.isArray(roles) ? roles : [roles]);
    }
  }

  getUserRoles(): Observable<string[]> {
    return this.userRoles.asObservable();
  }
}
