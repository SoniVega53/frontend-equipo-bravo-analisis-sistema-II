import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class SucursalService extends BaseService { 
  private readonly endpoint = 'console/sucursal';

  async getSucursales(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(sucursal: any): Promise<any> {
    const response: any = sucursal?.idSucursal
      ? await this.put<any>(`${this.endpoint}/${sucursal?.idSucursal}`, sucursal)
      : await this.post<any>(this.endpoint, sucursal);
    return response?.data?.sucursal || {}; 
  }

  async eliminar(id?: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}