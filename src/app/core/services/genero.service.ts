import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';

@Injectable({
  providedIn: 'root',
})
export class GeneroService extends BaseService {
  private readonly endpoint = 'console/genero';

  async getGenero(id?: number): Promise<Genero> {
    const respones: any = id
      ? await this.get<any>(`${this.endpoint}/${id}`)
      : await this.get<any>(this.endpoint);

    return respones?.data || {};
  }

  async crearToActualizar(genero: Genero): Promise<Genero> {
    const respones: any = genero?.idGenero
      ? await this.put<any>(`${this.endpoint}/${genero?.idGenero}`, genero)
      : await this.post<any>(this.endpoint, genero);
    return respones?.data?.genero || {};
  }

  async eliminar(id: number): Promise<any> {
    return this.delete<any>(`${this.endpoint}/${id}`);
  }
}
