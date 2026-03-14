import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpService } from './http.service';
interface Employee {
  id: string;
  employee_name: string;
  employee_salary: string;
  employee_age: string;
  profile_image: string;
}
interface EmployeeResponse {
  status: string;
  data: Employee[];
}
@Injectable({ providedIn: 'root' })
export class UserService {
  private endpoint = 'https://test.com';

  constructor(private http: HttpService) {}

  getUserDetails(): Observable<EmployeeResponse> {
    return this.http.get<EmployeeResponse>(`${this.endpoint}`);
  }
  getUserDetailsWithID(userId: string) {
    return this.http.get(`${this.endpoint}/${userId}`);
  }

  updateUserProfile(userId: string, data: any) {
    return this.http.post(`${this.endpoint}/${userId}`, data);
  }
}
