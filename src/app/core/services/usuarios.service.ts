import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseService {
  private readonly endpoint = 'usuarios';

  async getChangePassword(): Promise<any> {
    const respones: any = await this.get<any>(`${this.endpoint}/esChangePassword`);
    return respones?.data || {};
  }

}
