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
export class DefectCategoryService {
  private apiUrl = '/SIS/dashboard/shopview/getDefectCategoryPieChartData';

  constructor(private http: HttpService) {}

  getDefectCategoryData(
    fromDate: string,
    toDate: string,
  ): Observable<DefectCategoryData[]> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http
      .get<any>(this.apiUrl, params)
      .pipe(map((res) => res || []));
  }
}
