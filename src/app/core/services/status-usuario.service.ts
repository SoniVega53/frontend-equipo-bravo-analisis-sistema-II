import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { StatusUsuario } from '../../interface/status-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusUsuarioService extends BaseService {
  private readonly endpoint = 'console/status-usuario';

  async getStatusUsuario(id?: number): Promise<StatusUsuario> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || {};
  }

  async crearToActualizar(
    statusUsuario: StatusUsuario
  ): Promise<StatusUsuario> {
    const response: any = statusUsuario?.idStatusUsuario
      ? await this.put<any>(
          `${this.endpoint}/${statusUsuario.idStatusUsuario}`,
          statusUsuario
        )
      : await this.post<any>(
          this.endpoint,
          statusUsuario
        );

    return response?.data?.statusUsuario || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}