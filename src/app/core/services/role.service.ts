import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Role } from '../../interface/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService {
  private readonly endpoint = 'roles';

  async getRoles(id?: number): Promise<Role[]> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || response || [];
  }

  async crearOActualizar(role: Role): Promise<Role> {
    const response: any = role?.idRole
      ? await this.put<any>(`${this.endpoint}/${role.idRole}`, role)
      : await this.post<any>(this.endpoint, role);

    return response?.data || response || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}