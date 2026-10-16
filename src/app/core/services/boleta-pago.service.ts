import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BoletaPagoRequest } from '../../interface/boleta-pago.interface';

@Injectable({
  providedIn: 'root',
})
export class BoletaPagoService extends BaseService {
  private readonly endpoint = 'console/boleta-pago';

  async generarPdf(request: BoletaPagoRequest): Promise<Blob> {
    return this.toPromise<Blob>(
      this.http.post(`${this.apiUrl}/${this.endpoint}/generar-pdf`, request, {
        responseType: 'blob',
      })
    );
  }
}