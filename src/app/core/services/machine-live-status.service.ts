import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from './http.service';
export interface MachineLiveStatus {
  machineId: number;
  machineStatus: number;
  statusTimestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class MachineLiveStatusService {
  private apiUrl = '/SIS/dashboard/shopview/getMachineLiveStatus';

  constructor(private http: HttpService) {}

  getLiveStatus(machineId: number): Observable<MachineLiveStatus> {
    return this.http
      .get<any>(`${this.apiUrl}/${machineId}`, true)
      .pipe(map((res) => res?.machineLiveStatus));
  }
}
