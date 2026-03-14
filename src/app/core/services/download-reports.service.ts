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
export class DownloadReportsDataService {
  private readonly shopViewUrl = '/SIS/reports/downLoadShopViewFilteredReport';
  private readonly sheetSummaryUrl =
    '/SIS/reports/getSheetwiseSummuryWithFilters';
  private readonly filterReportUrl = '/SIS/reports/downLoadFilteredReport';

  constructor(private http: HttpService) {}

  getdownloadShopViewData(
    startDateTime: string,
    endDateTime: string,
  ): Observable<any> {
    const params = {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };
    const body = new URLSearchParams();
    body.set('filterDto', JSON.stringify(params));

    return this.http
      .post<any>(this.shopViewUrl, body.toString(), false, true)
      .pipe(map((res) => res || []));
  }

  getdownloadSheetSummaryData(
    startDateTime: string,
    endDateTime: string,
  ): Observable<any> {
    const params = {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };
    const body = new URLSearchParams();
    body.set('filterDto', JSON.stringify(params));

    return this.http
      .post<any>(this.sheetSummaryUrl, body.toString(), false, true)
      .pipe(map((res) => res || []));
  }

  getdownloadFilteredReportData(
    startDateTime: string,
    endDateTime: string,
  ): Observable<any> {
    const params = {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    };
    const body = new URLSearchParams();
    body.set('filterDto', JSON.stringify(params));

    return this.http
      .post<any>(this.filterReportUrl, body.toString(), false, true)
      .pipe(map((res) => res || []));
  }
}
