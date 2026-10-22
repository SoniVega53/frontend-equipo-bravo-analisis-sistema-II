import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BoletaPagoRequest } from '../../interface/boleta-pago.interface';
import { PlanillaResponse, ReportePlanillaRequest } from '../../interface/reporte-planilla.interface';

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

  async generarReporte(request: ReportePlanillaRequest): Promise<PlanillaResponse> {
    const response: any = await this.post<any>(`${this.endpoint}/generar`, request);
    return response?.data;
  }
}