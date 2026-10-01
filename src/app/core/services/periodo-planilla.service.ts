import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodoPlanillaService extends BaseService {
  private readonly endpoint = 'console/periodo-planilla';

  async getPeriodos(): Promise<any> {
    return this.get<any>(this.endpoint);
  }

  async getPeriodo(anio: number, mes: number): Promise<any> {
    return this.get<any>(`${this.endpoint}/${anio}/${mes}`);
  }

  async createPeriodo(data: any): Promise<any> {
    return this.post<any>(this.endpoint, data);
  }

  async updatePeriodo(anio: number, mes: number, data: any): Promise<any> {
    return this.put<any>(`${this.endpoint}/${anio}/${mes}`, data);
  }

  async deletePeriodo(anio: number, mes: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${anio}/${mes}`);
  }
}
