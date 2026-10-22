import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IEstadoCivil } from '../../interface/estado-civil.interface';

@Injectable({
  providedIn: 'root',
})
export class EstadoCivilService extends BaseService {
  private readonly endpoint = 'console/estado-civil';

  async getEstadoCivil(id?: number): Promise<any> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || [];
  }

  async crearToActualizar(item: IEstadoCivil): Promise<IEstadoCivil> {
    const respones: any = item?.idEstadoCivil
      ? await this.put<any>(`${this.endpoint}/${item.idEstadoCivil}`, item)
      : await this.post<any>(this.endpoint, item);
    return respones?.data?.estadoCivil || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
