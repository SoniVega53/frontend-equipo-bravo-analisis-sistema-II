import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IBanco } from '../../interface/banco.interface';

@Injectable({
  providedIn: 'root',
})
export class BancoService extends BaseService {
  private readonly endpoint = 'console/banco';

  async getBanco(id?: number): Promise<any> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || (id ? {} : []);
  }

  async crearToActualizar(item: IBanco): Promise<IBanco> {
    const respones: any = item?.idBanco
      ? await this.put<any>(`${this.endpoint}/${item.idBanco}`, item)
      : await this.post<any>(this.endpoint, item);
    return respones?.data?.banco || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
