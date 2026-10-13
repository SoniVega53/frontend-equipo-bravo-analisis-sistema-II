import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IPuesto } from '../../interface/puesto.interface';

@Injectable({
  providedIn: 'root',
})
export class PuestoService extends BaseService {
  private readonly endpoint = 'console/puesto';

  async getPuesto(id?: number): Promise<any> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || [];
  }

  async crearToActualizar(item: IPuesto): Promise<IPuesto> {
    const respones: any = item?.idPuesto
      ? await this.put<any>(`${this.endpoint}/${item.idPuesto}`, item)
      : await this.post<any>(this.endpoint, item);
    return respones?.data?.puesto || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
