import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private router = inject(Router);
  private readonly STORAGE_KEY = 'app_nav_params';
  private readonly SECRET_KEY = 'equipo-bravo-analisis-sistema-II';

  goTo(url: string, params?: Record<string, any>): void {
    if (params) {
      const currentParams = this.getParams();
      const mergedParams = { ...currentParams, ...params };

      if (typeof window !== 'undefined' && window.localStorage) {
        const jsonString = JSON.stringify(mergedParams);
        const encryptedData = CryptoJS.AES.encrypt(
          jsonString,
          this.SECRET_KEY,
        ).toString();

        localStorage.setItem(this.STORAGE_KEY, encryptedData);
      }
    }
    this.router.navigate([url]);
  }

  getParams<T = any>(key?: string): T {
    if (typeof window === 'undefined' || !window.localStorage) {
      return (key ? undefined : {}) as T;
    }

    const encryptedData = localStorage.getItem(this.STORAGE_KEY);
    if (!encryptedData) {
      return (key ? undefined : {}) as T;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        return (key ? undefined : {}) as T;
      }

      const parsedParams = JSON.parse(decryptedString);

      if (key) {
        return parsedParams[key];
      }
      return parsedParams as T;
    } catch (error) {
      console.error('Error al desencriptar parámetros de navegación', error);
      return (key ? undefined : {}) as T;
    }
  }

  clearParams(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
