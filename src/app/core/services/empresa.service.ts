import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Empresa } from '../../interface/empresa.interface';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService extends BaseService {

  async getEmpresas(): Promise<Empresa[]> {
    return await this.get<Empresa[]>('empresa');
  }

  async getEmpresa(id: number): Promise<Empresa> {
    return await this.get<Empresa>(`empresa/${id}`);
  }

  async crearToActualizar(empresa: Empresa): Promise<any> {

    if (empresa.idEmpresa) {
      return await this.put<Empresa>(
        `empresa/${empresa.idEmpresa}`,
        empresa
      );
    }

    return await this.post<Empresa>(
      'empresa',
      empresa
    );
  }

  async eliminar(id: number): Promise<any> {
    return await this.delete<any>(`empresa/${id}`);
  }


  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
  listarTodas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl + '/empresas', { headers: this.getHeaders() });
  }
}