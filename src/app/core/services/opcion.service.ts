import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class OpcionService extends BaseService { 
  private readonly endpoint = 'console/opcion';

  async getOpciones(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(opcion: any): Promise<any> {
    const response: any = opcion?.idOpcion
      ? await this.put<any>(`${this.endpoint}/${opcion?.idOpcion}`, opcion)
      : await this.post<any>(this.endpoint, opcion);
    return response?.data?.opcion || {}; 
  }

  async eliminar(id?: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}