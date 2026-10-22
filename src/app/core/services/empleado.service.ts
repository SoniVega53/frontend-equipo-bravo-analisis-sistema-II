
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService extends BaseService {

  private readonly endpoint = 'console/empleados';

  async getEmpleados(): Promise<any[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }
}

