import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { NavigationService } from '../core/services/navigation.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ApiErrorResponse } from '../interface/api-error-response';
import { RoleOpciones } from '../interface/rolo-opciones.interface';

export interface ExecuteServiceOptions {
  callback?: () => void | Promise<void>;
  callbackError?: (error: ApiErrorResponse) => void | Promise<void>;
  showLoading?: boolean;
  minDelay?: number;
}

export abstract class BaseComponent {
  protected router = inject(Router);
  protected authService = inject(AuthService);
  protected navigationService = inject(NavigationService);

  isLoading = false;

  roleSecurity: RoleOpciones = {
    consultar: false,
    alta: false,
    baja: false,
    cambio: false,
    imprimir: false,
    exportar: false,
  };

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

  protected setTime(callback: () => void | Promise<void>, time = 0) {
    setTimeout(async () => {
      await callback();
    }, time);
  }

  protected async executeService(
    options: ExecuteServiceOptions = {},
  ): Promise<void> {
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
      const apiError = error as ApiErrorResponse;

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
    return (
      !this.roleSecurity.cambio &&
      !this.roleSecurity.baja
    );
  }
}
