import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { PlanillaResponse, ReportePlanillaRequest } from '../../interface/reporte-planilla.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportePlanillaService extends BaseService {
  private readonly endpoint = 'console/reporte-planilla';

  async generarReporte(request: ReportePlanillaRequest): Promise<PlanillaResponse> {
    const response: any = await this.post<any>(`${this.endpoint}/generar`, request);
    return response?.data;
  }

  async generarPdf(request: ReportePlanillaRequest): Promise<Blob> {
    return this.toPromise<Blob>(
      this.http.post(`${this.apiUrl}/${this.endpoint}/generar-pdf`, request, {
        responseType: 'blob'
      })
    );
  }
}