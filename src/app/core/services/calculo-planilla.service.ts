import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { PlanillaRequest, PlanillaResponse } from '../../interface/calculo-planilla.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculoPlanillaService extends BaseService {
  private readonly endpoint = 'console/calculo-planilla';

  async procesarOObtenerPlanilla(request: PlanillaRequest): Promise<PlanillaResponse> {
    const response: any = await this.post<any>(`${this.endpoint}/procesar`, request);
    return response?.data;
  }
}