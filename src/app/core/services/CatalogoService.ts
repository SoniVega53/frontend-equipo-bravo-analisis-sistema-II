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

    async getMenus(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/menus`);
        return response?.data || [];
    }

    async getMenusIdModule(id:number): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/menus/${id}`);
        return response?.data || [];
    }

    async getModulos(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/modulos`);
        return response?.data || [];
    }


    async getEstadosCiviles(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/estados-civiles`);
        return response?.data || [];
    }

    async getStatusEmpleados(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/status-empleados`);
        return response?.data || [];
    }

    async getTiposDocumentos(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/tipos-documentos`);
        return response?.data || [];
    }

    async getDepartamentos(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/departamentos`);
        return response?.data || [];
    }

    async getPuestos(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/puestos`);
        return response?.data || [];
    }

    async getPuestosDepartamento(idDepartamento: number): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/puestos/departamento/${idDepartamento}`);
        return response?.data || [];
    }

    async getPersonas(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/personas`);
        return response?.data || [];
    }

    async getBancos(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/bancos`);
        return response?.data || [];
    }

    async getEmpleados(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/empleados`);
        return response?.data || [];
    }

    async getPeriodosPlanilla(): Promise<SelectOption[]> {
        const response: any = await this.get<any>(`${this.endpoint}/periodos-planilla`);
        return response?.data || [];
    }
}