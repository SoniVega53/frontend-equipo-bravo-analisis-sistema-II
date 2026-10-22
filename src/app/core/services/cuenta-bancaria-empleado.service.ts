
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CuentaBancariaEmpleado } from '../../interface/cuenta-bancaria-empleado.interface';

@Injectable({
  providedIn: 'root',
})
export class CuentaBancariaEmpleadoService extends BaseService {
  private readonly endpoint = 'console/cuentas-bancarias-empleados';

  async getCuentasBancariasEmpleado(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || {};
  }

  async crearToActualizar(
    cuenta: CuentaBancariaEmpleado
  ): Promise<CuentaBancariaEmpleado> {
    const response: any = cuenta?.idCuentaBancaria
      ? await this.put<any>(
          `${this.endpoint}/${cuenta.idCuentaBancaria}`,
          cuenta
        )
      : await this.post<any>(
          this.endpoint,
          cuenta
        );

    return response?.data?.cuentaBancariaEmpleado || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
