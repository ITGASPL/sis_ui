import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
export interface DefectCategoryData {
  defectCategory: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CurrentRecipeInformationService {
  private apiUrl = '/SIS/dashboard/productionview/getCurrentProgramDetails';

  constructor(private http: HttpService) {}

  getCurrentRecipeInformationData(): Observable<DefectCategoryData[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res || []));
  }
}
