import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

export interface InspectionProgram {
  programId: number;
  programNumber: number;
  equipmentId: number;
  equipmentName: string;
  model: string;
  modelId: number;
  partDescription: string;
  output1Description: string;
  feedLength: number;
  feedLengthUnit: string;
  widthNominal: number;
  widthUnit: string;
  cameraCount: number;
  listOfVarients: any[];
  updatedBy: any;
  createdBy: any;
}

export interface InspectionProgramResponse {
  alertMessages: {
    alertMessage: string;
  };
  paginationDtls: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    programNumber?: number;
  };
  listOfPrograms: InspectionProgram[];
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private getUnreadCountUrl = '/SIS/dashboard/alerts/unreadCount';
  private getMarkAsReadUrl = '/SIS/dashboard/alerts/markAsRead';
  private getAllAlertsUrl = '/SIS/dashboard/alerts/getAll';

  constructor(private httpService: HttpService) {}

  getUnreadCount(): Observable<any> {
    return this.httpService.get<any>(this.getUnreadCountUrl, {}, false);
  }
  markAsRead(): Observable<any> {
    return this.httpService.post<any>(this.getMarkAsReadUrl, {}, false);
  }
  getAllAlerts(
    pageNumber: number,
    pageSize: number,
    alertFilter?: {},
  ): Observable<any> {
    const body: any = {
      paginationDtls: {
        pageNumber,
        pageSize,
      },
    };
    if (alertFilter) body.alertFilter = alertFilter;
    return this.httpService.post<any>(this.getAllAlertsUrl, body, false);
  }
}
