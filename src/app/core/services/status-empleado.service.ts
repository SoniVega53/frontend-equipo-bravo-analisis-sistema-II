
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { StatusEmpleado } from '../../interface/status-empleado.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusEmpleadoService extends BaseService {
  private readonly endpoint = 'console/status-empleado';

  async getStatusEmpleado(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || {};
  }

  async crearToActualizar(
    statusEmpleado: StatusEmpleado
  ): Promise<StatusEmpleado> {
    const response: any = statusEmpleado?.idStatusEmpleado
      ? await this.put<any>(
          `${this.endpoint}/${statusEmpleado.idStatusEmpleado}`,
          statusEmpleado
        )
      : await this.post<any>(
          this.endpoint,
          statusEmpleado
        );

    return response?.data?.statusEmpleado || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
