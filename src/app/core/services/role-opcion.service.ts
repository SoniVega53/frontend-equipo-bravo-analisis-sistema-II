import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ListadoOpcionesItem, ModuloItem, RoleOpciones, RoleOpcionTabla } from '../../interface/rolo-opciones.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleOpcionService extends BaseService {
  private readonly endpoint = 'OpRole';

  async getPermisso(code: number): Promise<RoleOpciones> {
    const respones: any = await this.get<any>(`${this.endpoint}/${code}`);
    return respones?.data?.permisos || {};
  }

  async getTable(idRole: number,idModule:number): Promise<RoleOpciones> {
    const respones: any = await this.get<any>(`${this.endpoint}/tabla/${idRole}/${idModule}`);
    return respones?.data || [];
  }

  async getOpcionesList(): Promise<ListadoOpcionesItem> {
    const respones: any = await this.get<any>(`${this.endpoint}/modulo_role`);
    return respones?.data || [];
  }

  async modificarTabla(data:RoleOpcionTabla[]): Promise<any> {
    const respones: any = await this.put<any>(`${this.endpoint}/modificarTabla`,{
      roleOpcionItems: data
    });
    return respones?.data || [];
  }
}
