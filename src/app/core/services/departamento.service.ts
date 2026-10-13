import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IDepartamento } from '../../interface/departamento.interface';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService extends BaseService {
  private readonly endpoint = 'console/departamento';

  async getDepartamento(id?: number): Promise<any> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || [];
  }

  async crearToActualizar(item: IDepartamento): Promise<IDepartamento> {
    const respones: any = item?.idDepartamento
      ? await this.put<any>(`${this.endpoint}/${item.idDepartamento}`, item)
      : await this.post<any>(this.endpoint, item);
    return respones?.data?.departamento || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
