import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class StatusUsuarioService extends BaseService { 
  private readonly endpoint = 'console/status-usuario';

  async getStatusUsuarios(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(statusUsuario: any): Promise<any> {
    const response: any = statusUsuario?.idStatusUsuario
      ? await this.put<any>(`${this.endpoint}/${statusUsuario?.idStatusUsuario}`, statusUsuario)
      : await this.post<any>(this.endpoint, statusUsuario);
    return response?.data || {}; 
  }

  async eliminar(id?: string): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}