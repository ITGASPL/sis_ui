import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BreakData {
  id: number;
  start: string;
  end: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreaksService {
  private baseUrl = 'http://localhost:3000/breaks'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<BreakData[]> {
    return this.http.get<BreakData[]>(this.baseUrl);
  }

  add(data: BreakData): Observable<BreakData> {
    return this.http.post<BreakData>(this.baseUrl, data);
  }

  update(id: number, data: BreakData): Observable<BreakData> {
    return this.http.put<BreakData>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
