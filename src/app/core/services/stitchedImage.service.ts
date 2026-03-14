import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class StitchedImageService {
  private apiUrl = '/SIS/dashboard/productionview/getStitchedImage/{sheetId}';
  private xycoordinatesUrl =
    '/SIS/dashboard/productionview/getStitchedImagePopupInfo/{sheetId}';

  constructor(private http: HttpService) {}

  getStitchedImage(sheetId: string): Observable<Blob> {
    const url = this.apiUrl.replace('{sheetId}', sheetId);
    return this.http.getImage(url);
  }

  getXYCoordinates(sheetId: string): Observable<any> {
    const url = this.xycoordinatesUrl.replace('{sheetId}', sheetId);
    return this.http.get(url);
  }
}
