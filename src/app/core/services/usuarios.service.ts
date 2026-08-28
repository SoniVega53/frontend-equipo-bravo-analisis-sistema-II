import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';
import { IUsuario, UsuarioPasswordRequest, UsuarioRequest, UsuarioResponse, UsuarioSaveRequest } from '../../interface/usuario.interface';
import { Observable } from 'rxjs';

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


  async getFotografia(): Promise<any> {
    const respones: any = await this.get<any>(`${this.endpoint}/fotografia`);
    return respones?.data?.fotografia || {};
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


  async getUsuarios(): Promise<IUsuario[]> {
    const response: any = await this.get<any>(`${this.endpoint}/console/listar`);
    return response?.data || [];
  }

  async guardarUsuario(payload: UsuarioSaveRequest): Promise<any> {
    console.log('Payload enviado al servicio:', payload);
    return await this.post<any>(`${this.endpoint}/console/guardar`, payload);
  }

  async eliminarUsuario(idUsuario: string): Promise<any> {
    return await this.delete<any>(`${this.endpoint}/console/eliminar/${idUsuario}`);
  }

  /**
   * Sube una nueva fotografía para el usuario.
   * @param idUsuario El ID del usuario.
   * @param archivo El archivo de imagen seleccionado.
   */
  async actualizarFotografia(idUsuario: string, archivo: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', archivo);
    return await this.post<any>(`${this.endpoint}/${idUsuario}/fotografia`, formData);
  }

}
