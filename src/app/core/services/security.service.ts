import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';
import { UsuarioPasswordRequest, UsuarioRequest, UsuarioResponse } from '../../interface/usuario.interface';
import { PasswordPolicy } from '../../interface/password-policy';

@Injectable({
  providedIn: 'root',
})
export class SecurityService extends BaseService {
  private readonly endpoint = 'seguridad';

  async getPolicyPassword(): Promise<any> {
    const respones: any = await this.get<any>(`${this.endpoint}/password-policy`);
    return respones?.data || {};
  }

  async getPoliticaPassword(idEmpresa: number): Promise<PasswordPolicy> {
    const respones: any = await this.get<any>(`${this.endpoint}/password-policy/${idEmpresa}`);
    return respones?.data || {};
  }
}
