import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Genero } from '../../interface/genero.interface';

@Injectable({
  providedIn: 'root',
})
export class StatusUserService extends BaseService {
  private readonly endpoint = 'status-user';

  async getGenero(): Promise<Genero> {
    await this.get<any>(`${this.endpoint}`)

    return respones?.data || {};
  }

 
}
