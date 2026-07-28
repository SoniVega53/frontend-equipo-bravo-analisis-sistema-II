import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {

  navService = inject(NavigationService);

  async login(credentials: { idUsuario: string; password: string }): Promise<any> {
    const response = await this.post<any>('auth/login', credentials);

    if (response && response.data?.token) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('token', response.data.token);
      }
    }
    return response;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      this.navService.clearParams();
    }
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!this.getToken();
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private decodePayload(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      //console.log(JSON.parse(decoded));
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = this.decodePayload(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(new Date().getTime() / 1000);

    return payload.exp < currentTime;
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) {
      this.logout();
      return false;
    }

    return !this.isTokenExpired();
  }
}
