import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { NavigationService } from '../core/services/navigation.service';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export abstract class BaseComponent {
  protected router = inject(Router);
  protected authService = inject(AuthService);
  protected navigationService = inject(NavigationService);

  isLoading = false;
  errorMessage = '';

  protected handleError(
    err: any,
    defaultMsg: string = 'Ocurrió un error inesperado',
  ) {
    this.errorMessage = err.error?.mensaje || err.message || defaultMsg;
    this.isLoading = false;
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
}
