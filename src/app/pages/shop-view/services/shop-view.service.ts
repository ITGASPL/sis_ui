import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
export interface ShopViewSummary {
  partDescription: string | null;
  totalSheets: number;
  totalDefects: number;
  qualityPercentage: number;
  requiredMinThickness: number;
  requiredMaxThickness: number;
  actualMinThickness: number;
  actualMaxThickness: number;
  result: string;
}

@Injectable({
  providedIn: 'root',
})
export class ShopViewService {
  private apiUrl = '/SIS/dashboard/shopview/getShopViewSummary';

  constructor(private http: HttpService) {}

  getShopSummary(
    fromDate: string,
    toDate: string,
    isProductionView: boolean,
  ): Observable<ShopViewSummary[]> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('isProductionView', isProductionView.toString());

    return this.http
      .get<any>(this.apiUrl, params)
      .pipe(map((res) => res || []));
  }
}
