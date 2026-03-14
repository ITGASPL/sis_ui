import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

export interface StudentResponse {
  users: Student[];
  total: number;
  skip: number;
  limit: number;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private endpoint = 'https://dummyjson.com/users';

  constructor(private http: HttpClient) {}

  getStudentDetails(): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(this.endpoint);
  }
}
