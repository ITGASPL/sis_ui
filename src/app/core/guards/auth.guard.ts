import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login.service';
import { TokenService } from 'src/app/core/guards/token.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  canActivate(): boolean {
    if (this.loginService.isLoggedIn && this.tokenService.isTokenValid()) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
