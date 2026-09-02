import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService extends BaseService { 
  private readonly endpoint = 'console/empresa';

  async getEmpresas(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(empresa: any): Promise<any> {
    const response: any = empresa?.idEmpresa
      ? await this.put<any>(`${this.endpoint}/${empresa?.idEmpresa}`, empresa)
      : await this.post<any>(this.endpoint, empresa);
    return response?.data?.empresa || {}; 
  }

  async eliminar(id?: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}