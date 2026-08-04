import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { PasswordPolicy } from '../../interface/password-policy';
import { BaseComponent } from '../base.component';
import { UsuarioService } from '../../core/services/usuarios.service';
import { UsuarioPasswordRequest } from '../../interface/usuario.interface';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css'],
})
export class CambiarPasswordComponent extends BaseComponent implements OnInit {
  usuarioService = inject(UsuarioService);

  politicaPassword: PasswordPolicy = {
    regex: '',
    mensajeValidacion: 'Cargando políticas de seguridad...',
    largoMinimo: 8,
  };

  passwordActual = '';
  passwordNueva = '';
  confirmarPassword = '';

  errorMensaje = '';
  exitoMensaje = '';

  ngOnInit() {
    this.cargarPoliticas();
  }

  async cargarPoliticas() {
    await this.executeService({
      callback: async () => {
        const response = await this.securityService.getPolicyPassword();
        if (response) {
          this.politicaPassword = response;
        }
      },
    });
  }

  get isFormValid(): boolean {
    const cumpleRegex = this.politicaPassword.regex
      ? new RegExp(this.politicaPassword.regex).test(this.passwordNueva)
      : true;
    return (
      this.passwordActual.length > 0 &&
      this.passwordNueva.length >= (this.politicaPassword.largoMinimo || 8) &&
      cumpleRegex &&
      this.confirmarPassword.length > 0 &&
      this.passwordNueva === this.confirmarPassword
    );
  }

  get passwordsMismatch(): boolean {
    return (
      this.confirmarPassword.length > 0 &&
      this.passwordNueva !== this.confirmarPassword
    );
  }

  get cumpleLargo(): boolean {
    return (
      this.passwordNueva.length >= (this.politicaPassword.largoMinimo || 8)
    );
  }

  get cumpleRegex(): boolean {
    if (!this.politicaPassword.regex || this.passwordNueva.length === 0)
      return true;
    return new RegExp(this.politicaPassword.regex).test(this.passwordNueva);
  }

  async onSubmit() {
    if (!this.isFormValid) return;

    this.isLoading = true;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    await this.executeService({
      callback: async () => {
        const request: UsuarioPasswordRequest = {
          passwordOld: this.passwordActual,
          passwordNew: this.confirmarPassword,
        };
        const response = await this.usuarioService.putCambioPassword(request);
        if (response) {
          this.exitoMensaje = 'Contraseña actualizada correctamente.';
          this.passwordActual = '';
          this.passwordNueva = '';
          this.confirmarPassword = '';
        }
      },
      callbackError: (error)=>{
        if (error.codigoTexto === "AUTH_USER_BLOCKED_ATTEMPTS") {
          this.showErrorAlert(
            error?.mensaje || 'Ocurrió un error al procesar la solicitud.',
          );
          this.logout();
          return;
        }

        this.errorMensaje =
        error?.mensaje ||
        'Error al actualizar la contraseña. Verifica tu contraseña actual.';
      }
    });
  }
}
