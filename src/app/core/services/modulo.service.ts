import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ModuloService extends BaseService { 
  private readonly endpoint = 'console/modulo';

  async getModulos(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(modulo: any): Promise<any> {
    const response: any = modulo?.idModulo
      ? await this.put<any>(`${this.endpoint}/${modulo?.idModulo}`, modulo)
      : await this.post<any>(this.endpoint, modulo);
    return response?.data?.modulo || {}; 
  }

  async eliminar(id?: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}