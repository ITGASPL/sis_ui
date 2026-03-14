import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

export interface ProgramDto {
  programId: number;
  programNumber: number;
  cameraCount: number;
  equipmentId?: number;
  equipmentName?: string;
  model?: string;
  modelId?: number;
  partDescription?: string;
  output1Description?: string;
  blank3dProfile?: string;
  feedLength?: number;
  feedLengthUnit?: string;
  widthNominal?: number;
  widthUnit?: string;
  listOfVarients?: any[];
}

export interface Variant {
  id: number;
  variantName: string;
  commonName: string;
  coilCode: string;
  createdDate: number;
  createdBy: number;
  updatedDate: number;
  updatedBy: number;
  minimumSheetThickness: number;
  maximumSheetThickness: number;
  nominalSheetThickness: number;
  thicknessUnit: string | null;
  variantCode: string;
  partDescription: string;
  output1Description: string;
}

export interface VariantResponse {
  alertMessages: {
    alertMessage: string;
  };
  paginationDtls: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    varientName?: string;
  };
  variantList: Variant[];
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class VariantService {
  private readonly getAllSupportedVariantsUrl =
    '/SIS/masterData/recipe/getAllSupportedVariants';
  private readonly getAllUrl = '/SIS/masterData/recipe/getAllVariants';
  private readonly createUrl = '/SIS/masterData/recipe/createVariant';
  private readonly updateUrl = '/SIS/masterData/recipe/updateVariant';
  private readonly deleteUrl = '/SIS/masterData/recipe/deleteVariant';
  private readonly getImagedetails =
    '/SIS/masterData/recipe/variant/{variantId}/recipeProfile/{index}';

  constructor(private http: HttpService) {}

  getVariants(
    pageNumber: number,
    pageSize: number,
    varientName?: string,
  ): Observable<VariantResponse> {
    const body: any = { pageNumber, pageSize };
    if (varientName) body.varientName = varientName;
    return this.http.post<any>(this.getAllUrl, body, true);
  }

  getSupportedVariants(
    pageNumber: number,
    pageSize: number,
    varientName?: string,
  ): Observable<VariantResponse> {
    const body: any = { pageNumber, pageSize };
    if (varientName) body.varientName = varientName;
    return this.http.post<any>(this.getAllSupportedVariantsUrl, body, true);
  }
  createVariant(formData: any): Observable<any> {
    return this.http.post<any>(this.createUrl, formData, true);
  }

  updateVariant(formData: any): Observable<any> {
    return this.http.post<any>(this.updateUrl, formData, true);
  }

  deleteVariant(variantId: number): Observable<any> {
    const formData = new URLSearchParams();
    formData.set('variantMasterData', JSON.stringify({ id: variantId }));
    return this.http.post<any>(this.deleteUrl, formData.toString(), true, true);
  }
  getImagedetailsDataService(
    variantId: string,
    index: string,
  ): Observable<Blob> {
    const url = this.getImagedetails
      .replace('{variantId}', variantId)
      .replace('{index}', index);
    console.log('Fetching image details from URL:', url);
    return this.http.getImage(url, false, true);
  }
}
