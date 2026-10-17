
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Persona } from '../../interface/persona.interface';

@Injectable({
  providedIn: 'root',
})
export class PersonaService extends BaseService {
  private readonly endpoint = 'console/personas';

  async getPersonas(): Promise<Persona[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }
}
