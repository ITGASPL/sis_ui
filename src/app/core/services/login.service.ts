import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpService } from './http.service';
import { TokenService } from 'src/app/core/guards/token.service';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = '/SIS/api/login';
  isLoggedIn = false;
  constructor(
    private http: HttpService,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      setTimeout(() => {
        console.log;
        this.tokenService.clearToken();
        this.router.navigate(['/login']);
      }, 60 * 1000); // 1 minute
    }
  }

  setLoginStatus(status: boolean) {
    this.isLoggedIn = status;
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }
  isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }
  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authJWTToken');
  }

  response: any;
  login(credentials: { userName: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap((res) => {
        this.response = res; // ✅ Store the response in the service
        console.log('Login response stored:', this.response);
      }),
      map((res) => res || {}),
    );
  }
}
