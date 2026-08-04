import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';
import { UsuarioRequest, UsuarioResponse } from '../../interface/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends BaseService {
  private readonly endpoint = 'usuarios';

  async getChangePassword(): Promise<any> {
    const respones: any = await this.get<any>(`${this.endpoint}/esChangePassword`);
    return respones?.data || {};
  }


  async getPerfil(): Promise<UsuarioResponse> {
    const respones: any = await this.get<any>(`${this.endpoint}/perfil`);
    return respones?.data || {};
  }


  async postChangePassword(password:string): Promise<any> {
    const respones: any = await this.put<any>(`${this.endpoint}/primerIngreso`,{
      password:password
    });
    return respones?.data || {};
  }

  async putDataPerfil(request:UsuarioRequest): Promise<any> {
    const respones: any = await this.put<any>(`${this.endpoint}/perfilUpdate`,request);
    return respones?.data || {};
  }



}
