import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { RoleOpciones } from '../../interface/rolo-opciones.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleOpcionService extends BaseService {
  private readonly endpoint = 'OpRole';

  async getPermisso(page: string): Promise<RoleOpciones> {
    const respones: any = await this.get<any>(`${this.endpoint}/${page}`);
    return respones?.data?.permisos || {};
  }
}
