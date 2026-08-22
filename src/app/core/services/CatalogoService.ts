import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { SelectOption } from '../../interface/select-option.interface';

@Injectable({
    providedIn: 'root'
})
export class CatalogoService extends BaseService {
    private readonly endpoint = 'catalogos';

    async getEmpresas(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/empresas`);
        return response?.data || [];
    }

    async getSucursales(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/sucursales`);
        return response?.data || [];
    }

    async getSucursalesEmpresa(empresaId: number): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/sucursales/${empresaId}`);
        return response?.data || [];
    }

    async getGeneros(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/generos`);
        return response?.data || [];
    }

    async getStatusUsuario(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/status-usuario`);
        return response?.data || [];
    }

    async getRoles(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/roles`);
        return response?.data || [];
    }
}