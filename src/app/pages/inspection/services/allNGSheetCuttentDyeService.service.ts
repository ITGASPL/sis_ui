import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class AllNGSheetCurrentDyeService {
  private apiUrl = '/SIS/dashboard/productionview/getAllNGSheetsForCurrentDye';

  constructor(private http: HttpService) {}

  getAllNGSheetCurrentDye(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(map((res) => res || []));
  }
}
