import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { FlujoStatusEmpleado, StatusEmpleado } from '../../interface/flujo-status-empleado.interface';

@Injectable({ providedIn: 'root' })
export class FlujoStatusEmpleadoService extends BaseService {
  private readonly endpoint = 'console/flujo-status-empleado';
  private readonly statusEndpoint = 'console/status-empleado';

  async listarStatus(): Promise<StatusEmpleado[]> {
    const r: any = await this.get<any>(this.statusEndpoint);
    const data = r?.data ?? r;
    return Array.isArray(data) ? data : [];
  }

  async listarFlujos(): Promise<FlujoStatusEmpleado[]> {
    const r: any = await this.get<any>(this.endpoint);
    const data = r?.data ?? r;
    return Array.isArray(data) ? data : [];
  }

  async guardar(flujo: FlujoStatusEmpleado, editar: boolean): Promise<any> {
    if (editar) {
      return this.put<any>(
        `${this.endpoint}/${flujo.idStatusActual}/${flujo.idStatusNuevo}`,
        flujo
      );
    }
    return this.post<any>(this.endpoint, flujo);
  }

  async eliminar(actual: number, nuevo: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${actual}/${nuevo}`);
  }

  async validar(actual: number, nuevo: number): Promise<any> {
    return this.get<any>(
      `${this.endpoint}/validar?actual=${actual}&nuevo=${nuevo}`
    );
  }
}
