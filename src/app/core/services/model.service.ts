import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http.service';

export interface Model {
  id?: number;
  modelName: string;
  description?: string;
  createdDate?: number;
  createdBy?: number;
  updatedDate?: number;
  updatedBy?: number;
}

export interface ModelResponse {
  alertMessages: {
    alertMessage: string;
  };
  paginationDtls?: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    modelName?: string;
  };
  listOfModels?: Model[];
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private readonly createUrl = '/SIS/masterData/recipe/createModel';
  private readonly updateUrl = '/SIS/masterData/recipe/updateModel';
  private readonly getAllUrl = '/SIS/masterData/recipe/getAllModels';
  private readonly deleteUrl = '/SIS/masterData/recipe/deleteModel';

  constructor(private http: HttpService) {}

  createModel(model: Model): Observable<any> {
    const body = new URLSearchParams();
    body.set('modelMasterData', JSON.stringify(model));

    return this.http.post<any>(this.createUrl, body, true, true);
  }

  updateModel(model: Model): Observable<any> {
    const body = new URLSearchParams();
    body.set('modelMasterData', JSON.stringify(model));
    return this.http.post<any>(this.updateUrl, body.toString(), true, true);
  }

  getModels(
    pageNumber: number,
    pageSize: number,
    modelName?: string,
  ): Observable<ModelResponse> {
    const body: any = { pageNumber, pageSize };
    if (modelName) body.modelName = modelName;
    return this.http.post<ModelResponse>(this.getAllUrl, body, true);
  }

  deleteModel(modelId: number): Observable<any> {
    const body = new URLSearchParams();
    body.set('modelMasterData', JSON.stringify({ id: modelId }));
    return this.http.post<any>(this.deleteUrl, body.toString(), true, true);
  }
}
