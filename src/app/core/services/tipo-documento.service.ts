import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { TipoDocumento } from '../../interface/tipo-documento.interface';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService extends BaseService {
  private readonly endpoint = 'console/tipo-documento';

  async getTipoDocumento(id?: number): Promise<TipoDocumento> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || {};
  }

  async crearToActualizar(tipoDocumento: TipoDocumento): Promise<TipoDocumento> {
    const response: any = tipoDocumento?.idTipoDocumento
      ? await this.put<any>(`${this.endpoint}/${tipoDocumento.idTipoDocumento}`, tipoDocumento)
      : await this.post<any>(this.endpoint, tipoDocumento);
    return response?.data?.genero || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}