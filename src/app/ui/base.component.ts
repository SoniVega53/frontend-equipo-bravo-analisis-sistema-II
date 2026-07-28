import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { NavigationService } from '../core/services/navigation.service';
import { Router } from '@angular/router';

export abstract class BaseComponent {
  protected router = inject(Router);
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
}
