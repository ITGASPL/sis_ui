import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShiftData {
  id: number;
  shift: string;
  start: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private baseUrl = 'http://localhost:3000/shifts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ShiftData[]> {
    return this.http.get<ShiftData[]>(this.baseUrl);
  }

  add(data: ShiftData): Observable<ShiftData> {
    return this.http.post<ShiftData>(this.baseUrl, data);
  }

  update(id: number, data: ShiftData): Observable<ShiftData> {
    return this.http.put<ShiftData>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
