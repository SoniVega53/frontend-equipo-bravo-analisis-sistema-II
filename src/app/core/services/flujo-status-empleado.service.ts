import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import {
  FlujoStatusEmpleado,
  FlujoStatusEmpleadoSaveRequest,
  TransicionStatusPermitida,
} from '../../interface/flujo-status-empleado.interface';

@Injectable({
  providedIn: 'root',
})
export class FlujoStatusEmpleadoService extends BaseService {
  private readonly endpoint = 'console/flujo-status-empleado';

  async getFlujosDetallado(): Promise<FlujoStatusEmpleado[]> {
    const response: any = await this.get<any>(`${this.endpoint}/detallado`);
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al consultar flujos' };
    }
    return response?.data || [];
  }

  async getFlujos(): Promise<FlujoStatusEmpleado[]> {
    const response: any = await this.get<any>(this.endpoint);
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al consultar flujos' };
    }
    return response?.data || [];
  }

  async getFlujo(idStatusActual: number, idStatusNuevo: number): Promise<FlujoStatusEmpleado> {
    const response: any = await this.get<any>(`${this.endpoint}/${idStatusActual}/${idStatusNuevo}`);
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al consultar flujo' };
    }
    return response?.data || {};
  }


  async getTransicionesPermitidas(idStatusActual: number): Promise<TransicionStatusPermitida[]> {
    const response: any = await this.get<any>(`${this.endpoint}/status-actual/${idStatusActual}`);
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al consultar transiciones' };
    }
    return response?.data || [];
  }


  async crear(request: FlujoStatusEmpleadoSaveRequest): Promise<any> {
    const response: any = await this.post<any>(this.endpoint, request);
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al crear flujo' };
    }
    return response?.data?.flujoStatusEmpleado || response?.data || response;
  }

  
  async actualizar(
    idStatusActual: number,
    idStatusNuevo: number,
    request: FlujoStatusEmpleadoSaveRequest
  ): Promise<any> {
    const response: any = await this.put<any>(
      `${this.endpoint}/${idStatusActual}/${idStatusNuevo}`,
      request
    );
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al actualizar flujo' };
    }
    return response?.data?.flujoStatusEmpleado || response?.data || response;
  }

 
  async eliminar(idStatusActual: number, idStatusNuevo: number): Promise<any> {
    const response: any = await this.delete<any>(
      `${this.endpoint}/${idStatusActual}/${idStatusNuevo}`
    );
    if (response?.code && response.code !== 200) {
      throw { mensaje: response.message || response.mensaje || 'Error al eliminar flujo' };
    }
    return response?.data || response;
  }
}

