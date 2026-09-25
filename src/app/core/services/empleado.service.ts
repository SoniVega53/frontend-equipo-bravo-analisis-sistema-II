import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { EmpleadoBase } from '../../interface/liquidacion.interface';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService extends BaseService {
  private readonly endpoint = 'console/liquidacion';

  async getEmpleadoBase(idEmpleado: number): Promise<EmpleadoBase> {
    const response: any = await this.get<any>(`${this.endpoint}/empleado/${idEmpleado}/base`);
    return response?.data;
  }

  async getEmpleadosBase(): Promise<EmpleadoBase[]> {
    const response: any = await this.get<any>(`${this.endpoint}/empleados`);
    return response?.data || [];
  }
}
