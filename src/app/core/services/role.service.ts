import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseService { 
  private readonly endpoint = 'console/role';

  async getRoles(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(role: any): Promise<any> {
    const response: any = role?.idRole
      ? await this.put<any>(`${this.endpoint}/${role?.idRole}`, role)
      : await this.post<any>(this.endpoint, role);
    return response?.data?.role || {}; 
  }

  async eliminar(id?: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}