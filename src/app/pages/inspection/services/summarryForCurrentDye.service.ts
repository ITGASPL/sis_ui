import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ProductionViewCurrentDyeSummaryService {
  private apiUrl =
    '/SIS/dashboard/productionview/getProductionViewSummuryForCurrentDye';

  constructor(private http: HttpService) {}

  getProductionViewCurrentDyeSummary(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res || []));
  }
}
