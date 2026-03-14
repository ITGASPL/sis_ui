import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';
import { map } from 'rxjs/operators';

export interface Equipment {
  id?: number;
  line: string;
  equipmentName: string;
  equipmentGroup: string;
  createdDate?: number;
  createdBy?: number;
  updatedDate?: number;
  updatedBy?: number;
}

export interface EquipmentResponse {
  alertMessages: {
    alertMessage: string;
  };
  paginationDtls?: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    equipmentName?: string;
  };
  equipmentList?: Equipment[];
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private getAllEquipmentsUrl = '/SIS/masterData/recipe/getAllEquipments';
  private createEquipmentUrl = '/SIS/masterData/recipe/createEquipment';
  private updateEquipmentUrl = '/SIS/masterData/recipe/updateEquipment';
  private deleteEquipmentUrl = '/SIS/masterData/recipe/deleteEquipment';

  constructor(private httpService: HttpService) {}

  getAllEquipment(
    pageNumber: number,
    pageSize: number,
    equipmentName?: string,
  ): Observable<EquipmentResponse> {
    const body: any = { pageNumber, pageSize };
    if (equipmentName) body.equipmentName = equipmentName;
    return this.httpService
      .post<any>(this.getAllEquipmentsUrl, body, true)
      .pipe(
        map((res) => {
          console.log('data getting', res);
          return res;
        }),
      );
  }

  createEquipment(equipmentData: Equipment): Observable<EquipmentResponse> {
    const formData = new URLSearchParams();
    formData.set('equipmentMasterData', JSON.stringify(equipmentData));
    return this.httpService.post<EquipmentResponse>(
      this.createEquipmentUrl,
      formData.toString(),
      true,
      true,
    );
  }

  updateEquipment(equipmentData: Equipment): Observable<EquipmentResponse> {
    const formData = new URLSearchParams();
    formData.set('equipmentMasterData', JSON.stringify(equipmentData));
    return this.httpService.post<EquipmentResponse>(
      this.updateEquipmentUrl,
      formData.toString(),
      true,
      true,
    );
  }

  deleteEquipment(equipmentId: number): Observable<EquipmentResponse> {
    const formData = new URLSearchParams();
    formData.set('equipmentMasterData', JSON.stringify({ id: equipmentId }));
    return this.httpService.post<EquipmentResponse>(
      this.deleteEquipmentUrl,
      formData.toString(),
      true,
      true,
    );
  }
}
