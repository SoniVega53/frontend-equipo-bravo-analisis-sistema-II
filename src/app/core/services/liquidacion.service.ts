import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { EmpleadoBase, Liquidacion } from '../../interface/liquidacion.interface';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService extends BaseService {
  private readonly endpoint = 'console/liquidacion';

  async procesarLiquidacion(request: Liquidacion): Promise<Liquidacion> {
    console.log('Request to process liquidation:', request);
    const response: any = await this.post<any>(`${this.endpoint}/procesar`, request);
    return response?.data;
  }

  async obtenerTodas(): Promise<Liquidacion[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }

  async obtenerPorId(id: number): Promise<Liquidacion> {
    const response: any = await this.get<any>(`${this.endpoint}/${id}`);
    return response?.data;
  }

  async obtenerPorEmpleado(idEmpleado: number): Promise<Liquidacion> {
    const response: any = await this.get<any>(`${this.endpoint}/empleado/${idEmpleado}`);
    return response?.data;
  }

  async obtenerPorEmpleadoHistorial(idEmpleado: number): Promise<Liquidacion[]> {
    const response: any = await this.get<any>(`${this.endpoint}/empleado/${idEmpleado}/historial`);
    return response?.data || [];
  }

  async generarBoletaPdf(idLiquidacion: number): Promise<Blob> {
    return this.toPromise<Blob>(
      this.http.get(`${this.apiUrl}/${this.endpoint}/${idLiquidacion}/pdf`, {
        responseType: 'blob'
      })
    );
  }

    async getEmpleadoBase(idEmpleado: number): Promise<EmpleadoBase> {
      const response: any = await this.get<any>(`${this.endpoint}/empleado/${idEmpleado}/base`);
      return response?.data;
    }
  
    async getEmpleadosBase(): Promise<EmpleadoBase[]> {
      const response: any = await this.get<any>(`${this.endpoint}/empleados`);
      return response?.data || [];
    }
}