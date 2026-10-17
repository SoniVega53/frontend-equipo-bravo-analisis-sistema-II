import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IPersona } from '../../interface/persona.interface';

@Injectable({
  providedIn: 'root',
})
export class PersonaService extends BaseService {
  private readonly endpoint = 'console/persona';

  async getPersona(id?: number): Promise<any> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || (id ? {} : []);
  }

  async crearToActualizar(item: IPersona): Promise<IPersona> {
    const respones: any = item?.idPersona
      ? await this.put<any>(`${this.endpoint}/${item.idPersona}`, item)
      : await this.post<any>(this.endpoint, item);
    return respones?.data?.persona || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }

  async getPersonas(): Promise<Persona[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }
}
