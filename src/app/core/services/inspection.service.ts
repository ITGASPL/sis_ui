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
export class InspectionService {
  private getAllProgramsUrl = '/SIS/masterData/recipe/getAllInspectionPrograms';
  private createProgramUrl = '/SIS/masterData/recipe/createInspectionProgram';
  private updateProgramUrl = '/SIS/masterData/recipe/updateInspectionProgram';
  private getActiveCamerasUrl = '/SIS/masterData/recipe/getAllActiveCameras';

  constructor(private httpService: HttpService) {}

  getAllInspectionPrograms(
    pageNumber: number,
    pageSize: number,
    programNumber?: number,
  ): Observable<any> {
    const body: any = {
      pageNumber,
      pageSize,
    };

    if (programNumber !== undefined) {
      body.programNumber = programNumber;
    }

    return this.httpService.post<any>(this.getAllProgramsUrl, body);
  }

  getSupportedPrograms(
    pageNumber: number,
    pageSize: number,
    programNumber?: number,
  ): Observable<InspectionProgramResponse> {
    const body: any = { pageNumber, pageSize };
    if (programNumber) body.programNumber = programNumber;
    return this.httpService.post<any>(this.getAllProgramsUrl, body);
  }

  getActiveCameras(): Observable<any> {
    return this.httpService.get<any>(this.getActiveCamerasUrl, {}, true);
  }

  createInspectionProgram(
    inspectionProgramData: any,
    recipeProfile?: File,
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'inspectionProgramData',
      JSON.stringify(inspectionProgramData),
    );

    if (recipeProfile) {
      formData.append('recipeProfile', recipeProfile);
    }

    return this.httpService.post<any>(this.createProgramUrl, formData);
  }

  updateInspectionProgram(
    inspectionProgramData: any,
    recipeProfile?: File,
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'inspectionProgramData',
      JSON.stringify(inspectionProgramData),
    );

    if (recipeProfile) {
      formData.append('recipeProfile', recipeProfile);
    }

    return this.httpService.post<any>(this.updateProgramUrl, formData);
  }
}
