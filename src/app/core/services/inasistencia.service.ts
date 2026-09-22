import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Inasistencia } from '../../interface/inasistencia.interface';

@Injectable({
  providedIn: 'root'
})
export class InasistenciaService extends BaseService {
  private readonly endpoint = 'console/inasistencias';

  async getInasistencias(): Promise<Inasistencia[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }

  async getInasistenciasPorEmpleado(idEmpleado: number): Promise<Inasistencia[]> {
    const response: any = await this.get<any>(`${this.endpoint}/empleado/${idEmpleado}`);
    return response?.data || [];
  }

  async crearInasistencia(inasistencia: Inasistencia): Promise<Inasistencia> {
    console.log(inasistencia)
    const response: any = await this.post<any>(this.endpoint, inasistencia);
    return response?.data;
  }

  async actualizarInasistencia(id: number, inasistencia: Inasistencia): Promise<Inasistencia> {
    const response: any = await this.put<any>(`${this.endpoint}/${id}`, inasistencia);
    return response?.data;
  }

  async eliminarInasistencia(id: number): Promise<void> {
    await this.delete<any>(`${this.endpoint}/${id}`);
  }
}