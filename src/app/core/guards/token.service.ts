import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private TOKEN_KEY = 'authJWTToken';
  private EXPIRY_KEY = 'authJWTToken_expiry';
  private EXPIRY_DURATION = 900 * 1000; // 15 minutes

  setToken(token: string): void {
    const now = new Date().getTime();
    const expiry = now + this.EXPIRY_DURATION;

    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
  }

  getToken(): string | null {
    const now = new Date().getTime();
    const expiry = localStorage.getItem(this.EXPIRY_KEY);

    if (expiry && now < parseInt(expiry)) {
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      this.clearToken();
      return null;
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
  }

  isTokenValid(): boolean {
    return this.getToken() !== null;
  }
}
