import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IEmpleado } from '../../interface/empleado.interface';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoCrudService extends BaseService {
  private readonly endpoint = 'console/empleado';

  async getEmpleado(id?: number): Promise<any> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || (id ? {} : []);
  }

  async crearToActualizar(item: IEmpleado): Promise<IEmpleado> {
    const respones: any = item?.idEmpleado
      ? await this.put<any>(`${this.endpoint}/${item.idEmpleado}`, item)
      : await this.post<any>(this.endpoint, item);
    return respones?.data?.empleado || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }

  async getStatusPermitidos(id: number): Promise<any[]> {
    const respones: any = await this.get<any>(`${this.endpoint}/${id}/status-permitidos`);
    return respones?.data || [];
  }
}
