import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VariantData {
  id: number;
  variant: string;
  commonName: string;
}

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  private baseUrl = 'http://localhost:3000/variant'; // Update for JSON server

  constructor(private http: HttpClient) {}

  getAll(): Observable<VariantData[]> {
    return this.http.get<VariantData[]>(this.baseUrl);
  }

  add(data: VariantData): Observable<VariantData> {
    return this.http.post<VariantData>(this.baseUrl, data);
  }

  update(id: number, data: VariantData): Observable<VariantData> {
    return this.http.put<VariantData>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
