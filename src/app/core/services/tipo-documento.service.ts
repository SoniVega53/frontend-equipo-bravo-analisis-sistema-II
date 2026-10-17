import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { TipoDocumento } from '../../interface/tipo-documento.interface';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumentoService extends BaseService {
  private readonly endpoint = 'console/tipos-documento';

  async getTiposDocumento(): Promise<TipoDocumento[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }
}
