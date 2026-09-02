import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends BaseService { 
  private readonly endpoint = 'console/menu';

  async getMenus(id?: number): Promise<any> {
    const response: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return response?.data || (id ? {} : []); 
  }

  async crearToActualizar(menu: any): Promise<any> {
    const response: any = menu?.idMenu
      ? await this.put<any>(`${this.endpoint}/${menu?.idMenu}`, menu)
      : await this.post<any>(this.endpoint, menu);
    return response?.data?.menu || {}; 
  }

  async eliminar(id?: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`); 
  }
}