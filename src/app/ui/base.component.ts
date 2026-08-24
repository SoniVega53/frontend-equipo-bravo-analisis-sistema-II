import { inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NavigationService } from '../core/services/navigation.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ApiErrorResponse } from '../interface/api-error-response';
import { CODE_ERROR_PERMIT, RoleOpciones } from '../interface/rolo-opciones.interface';
import { RoleOpcionService } from '../core/services/role-opcion.service';
import { APP_CONSTANTS } from '../shared/app.constants';
import { SelectOption } from '../interface/select-option.interface';
import { SecurityService } from '../core/services/security.service';
import { DynamicField } from '../interface/dynamic-field.interface';
import { CatalogoService } from '../core/services/CatalogoService';

export interface ExecuteServiceOptions {
  callback?: () => void | Promise<void>;
  callbackError?: (error: ApiErrorResponse) => void | Promise<void>;
  showLoading?: boolean;
  minDelay?: number;
}

export abstract class BaseComponent {
  protected router = inject(Router);
  protected authService = inject(AuthService);
  protected roleOpService = inject(RoleOpcionService);
  protected navigationService = inject(NavigationService);
  protected securityService = inject(SecurityService);
  protected catalogoService = inject(CatalogoService);
  protected rutaActual: string = '';

  urlBase = APP_CONSTANTS.URL_BASE.TYPE_1;
  urlBase2 = APP_CONSTANTS.URL_BASE.TYPE_2;

  isLoading = false;
  isLoadingPage = false;

  roleSecurity: RoleOpciones = {
    consultar: false,
    alta: false,
    baja: false,
    cambio: false,
    imprimir: false,
    exportar: false,
  };

  protected getRutaOffHome() {
    return this.router.url.replace(this.urlBase, '');
  }

  protected navigateTo(url: string, params?: Record<string, any>): void {
    this.navigationService.goTo(url, params);
  }

  protected getNavParams<T = any>(key?: string): T {
    return this.navigationService.getParams<T>(key);
  }

  protected clearNavParams(): void {
    this.navigationService.clearParams();
  }

  protected getDataToken() {
    const token = this.authService.getToken();
    if (token) {
      const data = this.authService.decodePayload(token);
      return {
        user: data.sub,
        role: data.role,
      };
    }
    return '';
  }

  protected showSuccessAlert(message: string, title: string = '¡Éxito!') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  protected showErrorAlert(message: string, title: string = '¡Error!') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
    });
  }

  protected showWarningAlert(message: string, title: string = 'Atención') {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'Entendido',
    });
  }

  protected showDeleteConfirm(
    callback: () => void | Promise<void>,
    itemName: string = 'este registro',
  ) {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--color-danger)',
      cancelButtonColor: 'var(--text-muted, #6c757d)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await callback();
      }
    });
  }

  protected showSessionEndedAlert(
    message: string = 'Por seguridad, tu sesión ha caducado. Por favor, vuelve a ingresar.',
    title: string = 'Sesión finalizada',
  ) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  protected logout() {
    this.authService.logout();
    this.navigateTo('/login');
  }

  protected async executeService(
    options: ExecuteServiceOptions = {},
    isLoggedIn: boolean = true,
  ): Promise<void> {
    if (this.authService.isTokenExpired() && isLoggedIn) {
      this.logout();
      this.showSessionEndedAlert();
      return;
    }

    const {
      callback,
      callbackError,
      showLoading = true,
      minDelay = 300,
    } = options;

    if (showLoading) {
      this.isLoading = true;
    }

    try {
      if (callback) {
        await Promise.all([
          callback(),
          new Promise((resolve) => setTimeout(resolve, minDelay)),
        ]);
      }
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as ApiErrorResponse;
      if (apiError.codigoNumerico == 4001 && isLoggedIn) {
        return;
      }

      if (CODE_ERROR_PERMIT[apiError.codigoNumerico] && isLoggedIn) {
        const tipo = CODE_ERROR_PERMIT[apiError.codigoNumerico];
        if (tipo) {
          this.roleSecurity[tipo] = false;
        }
      }

      if (apiError.codigoTexto === 'SESION_INVALIDA') {
        this.showErrorAlert(
          apiError?.mensaje || 'Ocurrió un error al procesar la solicitud.',
        );
        this.logout();
        return;
      }

      if (apiError.codigoNumerico == 1501 && isLoggedIn) {
        this.logout();
        this.showErrorAlert(
          apiError?.mensaje || 'Ocurrió un error al procesar la solicitud.',
        );
        return;
      }

      if ((apiError.codigoTexto === "AUTH_USER_BLOCKED" || apiError.codigoTexto === "AUTH_USER_INACTIVE") && !isLoggedIn) {
        this.showErrorAlert(
          apiError?.mensaje || 'Ocurrió un error al procesar la solicitud.',
        );
        setTimeout(() => {  
          this.navigateTo('/login');
        },1000);
        return;
      }


      if (callbackError) {
        await callbackError(apiError);
        return;
      }

      this.showErrorAlert(
        apiError?.mensaje || 'Ocurrió un error al procesar la solicitud.',
      );
    } finally {
      if (showLoading) {
        this.isLoading = false;
      }
    }
  }

  protected showDeleteButton(id?: any): boolean {
    return !!this.roleSecurity.baja && !!id;
  }

  protected showSaveButton(id?: any): boolean {
    if (id) {
      return this.roleSecurity?.cambio || false;
    }
    return this.roleSecurity?.alta || false;
  }

  protected hiddenFormulary(): boolean {
    return (
      !this.roleSecurity.cambio &&
      !this.roleSecurity.alta &&
      !this.roleSecurity.baja
    );
  }

  protected hiddenAction(): boolean {
    return !this.roleSecurity.cambio && !this.roleSecurity.baja;
  }

  pagePermission(opciones: RoleOpciones): boolean {
    const valores = Object.values(opciones);
    return valores.every((valor) => !valor);
  }

  async cargarPermisos(showLoading: boolean = true) {
    if (showLoading) {
      this.isLoadingPage = true;
    }
    try {
      const roleOp = await this.roleOpService.getPermisso(
        this.getRutaOffHome(),
      );
      if (roleOp) {
        this.roleSecurity = { ...this.roleSecurity, ...roleOp };

        if ( !roleOp.alta && !roleOp.baja && !roleOp.consultar && !roleOp.cambio) {
          this.navigateTo(`/home`);
        }

        if (this.pagePermission(this.roleSecurity)) {
          //this.navigateTo(`${this.urlBase}403`);
          this.navigateTo(`/home`);
        }
      }
    } catch (error) {
      this.navigateTo(`${this.urlBase}403`);
    } finally {
      if (showLoading) {
        this.isLoadingPage = false;
      }
    }
  }

  async convertirOption(
    model: any[],
    idSelect: number,
    option: SelectOption,
  ): Promise<SelectOption[]> {
    return model.map((res) => ({
      codigo: res[option.codigo],
      valor: res[option.valor],
      seleccionado: res[option.codigo] == idSelect ? 1 : 0,
    }));
  }

  formatDateFromObject(isoString: string): string {
    if (!isoString) return '';
    
    const d = new Date(isoString);
    
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    
    return `${year}-${month}-${day}`;
  }

  findToItemField(configuraciones:any[],name:string):DynamicField{
    return configuraciones.find(res => res.name === name);
  }
}
