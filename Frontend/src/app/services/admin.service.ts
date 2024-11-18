
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:5000/api'; // Update this with your backend API URL

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  assignRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/assign-role`, { userId, role });
  }

  createRole(roleName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/create-role`, { roleName });
  }
}
