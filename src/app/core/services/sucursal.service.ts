import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Sucursal } from '../../interface/sucursal.interface';


@Injectable({
  providedIn: 'root',
})
export class SucursalService extends BaseService {
  private readonly endpoint = 'api/sucursales';

  async listarTodas(): Promise<Sucursal[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || response || [];
  }

  async obtenerPorId(id: number): Promise<Sucursal> {
    const response: any = await this.get<any>(`${this.endpoint}/${id}`);
    return response?.data || response || {};
  }

  async crearToActualizar(sucursal: Sucursal): Promise<Sucursal> {
    const payload = this.prepararPayload(sucursal);
    
    const id = sucursal?.idSucursal; 

    const response: any = id
      ? await this.put<any>(`${this.endpoint}/${id}`, payload)
      : await this.post<any>(this.endpoint, payload);
      
    return response?.data?.sucursal || response?.data || response || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }

  private prepararPayload(sucursal: Sucursal): Sucursal {
    return {
      ...sucursal,
      idEmpresa: sucursal.empresa?.idEmpresa || sucursal.idEmpresa,
      usuarioCreacion: sucursal.usuarioCreacion || 'system',
      fechaCreacion: sucursal.fechaCreacion || new Date().toISOString()
    };
  }
}