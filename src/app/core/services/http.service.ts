import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl;

  private handleError(error: any) {
    return throwError(() => error);
  }

  get<T>(url: string, params?: any, skipAuth: boolean = false): Observable<T> {
    const headers = skipAuth
      ? undefined
      : new HttpHeaders({ 'X-Skip-Auth': 'true' });
    return this.http
      .get<T>(`${this.baseUrl}${url}`, { headers, params })
      .pipe(catchError(this.handleError));
  }
  getImage(
    url: string,
    params?: any,
    skipAuth: boolean = false,
  ): Observable<Blob> {
    const headers = skipAuth
      ? undefined
      : new HttpHeaders({ 'X-Skip-Auth': 'true' });

    return this.http
      .get(`${this.baseUrl}${url}`, {
        headers,
        params,
        responseType: 'blob' as 'blob',
      })
      .pipe(catchError(this.handleError));
  }

  post<T>(
    url: string,
    data: any,
    skipAuth: boolean = false,
    MasterApi: boolean = false,
  ): Observable<T> {
    const headers = MasterApi
      ? new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
      : undefined;
    return this.http
      .post<T>(`${this.baseUrl}${url}`, data, { headers })
      .pipe(catchError(this.handleError));
  }

  postBlob(url: string, data: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}${url}`, data, {
      responseType: 'blob' as 'json',
    }) as Observable<Blob>;
  }
}
