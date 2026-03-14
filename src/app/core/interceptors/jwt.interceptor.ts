import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoginService } from 'src/app/core/services/login.service';

export const JwtInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const authService = inject(LoginService);

  let token = localStorage.getItem('authJWTToken');

  if (request.headers.has('X-Skip-Auth')) {
    const modified = request.clone({
      headers: request.headers.delete('X-Skip-Auth'),
    });

    return next(modified);
  }

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `token ${token}`,
      },
    });
  }

  return next(request);
};
