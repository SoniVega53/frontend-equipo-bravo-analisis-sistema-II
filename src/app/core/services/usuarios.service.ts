import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';
import {
  UsuarioPasswordRequest,
  UsuarioRequest,
  UsuarioResponse,
  UsuarioCrud,
  UsuarioCrudResponse
} from '../../interface/usuario.interface';


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


  async putCambioPassword(request:UsuarioPasswordRequest): Promise<any> {
    const respones: any = await this.put<any>(`${this.endpoint}/changePassword`,request);
    return respones?.data || {};
  }

  async getUsuarios(): Promise<UsuarioCrudResponse[]> {
  const response: any = await this.get<any>(this.endpoint);
  return response?.data || [];
}

async getUsuario(idUsuario: string): Promise<UsuarioCrudResponse> {
  const response: any = await this.get<any>(
    `${this.endpoint}/${idUsuario}`
  );
  return response?.data || {};
}

async crearUsuario(usuario: UsuarioCrud): Promise<any> {
  const response: any = await this.post<any>(
    this.endpoint,
    usuario
  );
  return response?.data || {};
}

async actualizarUsuario(
  idUsuario: string,
  usuario: UsuarioCrud
): Promise<any> {
  const response: any = await this.put<any>(
    `${this.endpoint}/${idUsuario}`,
    usuario
  );
  return response?.data || {};
}

async eliminarUsuario(idUsuario: string): Promise<any> {
  return this.delete<any>(
    `${this.endpoint}/${idUsuario}`
  );
}



}
