import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheTokenService {
  private token: string | null = null;
  private expiryTimer: any;

  // Set token with 1-minute expiry
  setToken(token: string): void {
    this.token = token;

    // Clear any previous timers
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
    }

    // Set expiry after 1 minute (60,000 ms)
    this.expiryTimer = setTimeout(() => {
      this.clearToken();
    }, 60000);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
    }
  }

  isTokenValid(): boolean {
    return this.token !== null;
  }
}
