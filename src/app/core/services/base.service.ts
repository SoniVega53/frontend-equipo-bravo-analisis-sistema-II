import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiErrorResponse } from '../../interface/api-error-response';
import { environment } from '../../../environments/environment';

export abstract class BaseService {
  protected http = inject(HttpClient);
  protected apiUrl = environment.apiUrl;

  protected async toPromise<T>(observable$: any): Promise<T> {
    try {
      return await firstValueFrom(observable$);
    } catch (error: any) {
      if (error instanceof HttpErrorResponse && error.error) {
        const apiError: ApiErrorResponse = error.error;
        throw apiError;
      }
      // Error genérico de red o conexión
      throw {
        exito: false,
        codigoNumerico: 500,
        codigoTexto: 'NETWORK_ERROR',
        mensaje: error.message || 'Error al conectar con el servidor',
      };
    }
  }

  // Métodos HTTP estandarizados envueltos en toPromise
  protected async get<T>(endpoint: string): Promise<T> {
    return this.toPromise<T>(this.http.get<T>(`${this.apiUrl}/${endpoint}`));
  }

  protected async post<T>(endpoint: string, body: any): Promise<T> {
    return this.toPromise<T>(
      this.http.post<T>(`${this.apiUrl}/${endpoint}`, body),
    );
  }

  protected async put<T>(endpoint: string, body: any): Promise<T> {
    return this.toPromise<T>(
      this.http.put<T>(`${this.apiUrl}/${endpoint}`, body),
    );
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.toPromise<T>(this.http.delete<T>(`${this.apiUrl}/${endpoint}`));
  }
}
