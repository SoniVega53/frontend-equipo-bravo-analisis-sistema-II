
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class BancoService extends BaseService {

  private readonly endpoint = 'console/bancos';

  async getBancos(): Promise<any[]> {
    const response: any = await this.get<any>(this.endpoint);
    return response?.data || [];
  }
}
