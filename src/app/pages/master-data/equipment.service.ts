import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Equipment {
  id: number;
  line: string;
  equipmentName: string;
  equipmentGroup: string;
}

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private baseUrl = 'http://localhost:3000/equipment';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.baseUrl);
  }

  add(data: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.baseUrl, data);
  }

  update(id: number, data: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.baseUrl}/${id}`, data);

  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
