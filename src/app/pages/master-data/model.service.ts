import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface ModelData {
    id: number;
    model: string;
    description: string;
  }
  @Injectable({
    providedIn: 'root',
  })
  export class ModelService {
    private baseUrl = 'http://localhost:3000/model'; 
  
    constructor(private http: HttpClient) {}
  
    getAll(): Observable<ModelData[]> {
      return this.http.get<ModelData[]>(this.baseUrl);
    }
  
    add(data: ModelData): Observable<ModelData> {
      return this.http.post<ModelData>(this.baseUrl, data);
    }
  
    update(id: number, data: ModelData): Observable<ModelData> {
      return this.http.put<ModelData>(`${this.baseUrl}/${id}`, data);
    }
  
    delete(id: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/${id}`);
    }
  }
  