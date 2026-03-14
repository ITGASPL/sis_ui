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
export class DownloadSheetWiseDataService {
  private apiUrl = '/SIS/reports/getSheetwiseSummuryWithFilters';

  constructor(private http: HttpService) {}

  getdownloadSheetWiseData(fromDate: string, toDate: string): Observable<any> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.postBlob(this.apiUrl, params);
  }
}
