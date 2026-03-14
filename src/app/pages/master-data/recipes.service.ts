import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Recipe {
  id: number;
  equipmentId: string;
  dieNumber: number;
  model: string;
  partDescription: string;
  variant: string;
  coilCode: string;
  outputDescription: string;
  thicknessNominal: number;
  thicknessUpper: number;
  thicknessLower: number;
  thicknessUnit: string;
  feedLength: number;
  feedLengthUnit: string;
  widthNominal: number;
  widthUnit: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private baseUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl);
  }

  add(data: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, data);
  }

  update(id: number, data: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
