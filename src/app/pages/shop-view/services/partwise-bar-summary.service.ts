import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

export interface PartwiseBarChartData {
  partDescription: string;
  programId: number;
  totalSheets: number;
  totalDefectiveSheets: number;
  totalGoodSheets: number;
  totalDefects: number;
  qualityPercentage: number;
}

@Injectable({
  providedIn: 'root',
})
export class PartwiseBarSummaryService {
  private apiUrl = '/SIS/dashboard/shopview/getPartwiseSummuryForBarChart';

  constructor(private http: HttpService) {}

  getBarChartData(
    fromDate: string,
    toDate: string,
  ): Observable<PartwiseBarChartData[]> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http
      .get<any>(this.apiUrl, params)
      .pipe(map((res) => res || []));
  }
}
