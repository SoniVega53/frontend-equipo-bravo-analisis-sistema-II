import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { BaseComponent } from '../base.component';
import { PasswordPolicy } from '../../interface/password-policy';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent extends BaseComponent {

  private http = inject(HttpClient);

  paso = 1;

  idUsuario = '';
  pregunta = '';
  respuesta = '';

  passwordNueva = '';
  confirmarPassword = '';

  errorMensaje = '';
  exitoMensaje = '';

  politicaPassword: PasswordPolicy = {
    regex: '',
    mensajeValidacion: '',
    largoMinimo: 8,
  };

  async cargarPoliticaPassword() {

    if (!this.idUsuario.trim()) {
      return;
    }

    try {

      const response = await firstValueFrom(
        this.http.get<PasswordPolicy>(
          `http://localhost:8080/api/auth/password-policy?idUsuario=${encodeURIComponent(
            this.idUsuario.trim()
          )}`
        )
      );

      this.politicaPassword = response;

    } catch {

      this.politicaPassword = {
        regex: '^.{8,}$',
        mensajeValidacion:
          'La contraseña debe tener un mínimo de 8 caracteres.',
        largoMinimo: 8,
      };
    }
  }

  async buscarUsuario() {

    if (!this.idUsuario.trim()) {
      this.errorMensaje = 'Ingresa tu usuario.';
      return;
    }

    this.errorMensaje = '';
    this.isLoading = true;

    try {

      const response = await firstValueFrom(
        this.http.get<{ pregunta: string }>(
          `http://localhost:8080/api/auth/pregunta/${encodeURIComponent(
            this.idUsuario.trim()
          )}`
        )
      );

      this.pregunta = response.pregunta;

      await this.cargarPoliticaPassword();

      this.paso = 2;

    } catch {

      this.errorMensaje =
        'No se encontró el usuario.';

    } finally {

      this.isLoading = false;
    }
  }

  async validarRespuesta() {

    if (!this.respuesta.trim()) {
      this.errorMensaje =
        'Ingresa la respuesta de seguridad.';
      return;
    }

    this.errorMensaje = '';
    this.isLoading = true;

    try {

      const valida = await firstValueFrom(
        this.http.post<boolean>(
          'http://localhost:8080/api/auth/validar-respuesta',
          {
            idUsuario: this.idUsuario.trim(),
            respuesta: this.respuesta.trim(),
          }
        )
      );

      if (valida) {

        this.paso = 3;

      } else {

        this.errorMensaje =
          'La respuesta de seguridad es incorrecta.';
      }

    } catch {

      this.errorMensaje =
        'No fue posible validar la respuesta.';

    } finally {

      this.isLoading = false;
    }
  }

  get passwordsMismatch(): boolean {

    return (
      this.confirmarPassword.length > 0 &&
      this.passwordNueva !==
        this.confirmarPassword
    );
  }

  get cumpleLargo(): boolean {

    return (
      this.passwordNueva.length >=
      (this.politicaPassword.largoMinimo || 8)
    );
  }

  get cumpleRegex(): boolean {

    if (
      !this.politicaPassword.regex ||
      this.passwordNueva.length === 0
    ) {
      return true;
    }

    try {

      return new RegExp(
        this.politicaPassword.regex
      ).test(this.passwordNueva);

    } catch {

      return false;
    }
  }

  get passwordValida(): boolean {

    return (
      this.cumpleLargo &&
      this.cumpleRegex &&
      this.passwordNueva ===
        this.confirmarPassword &&
      this.confirmarPassword.length > 0
    );
  }

  async cambiarPassword() {

    if (!this.passwordValida) {

      this.errorMensaje =
        this.politicaPassword
          .mensajeValidacion ||
        'La contraseña no cumple con la política de seguridad.';

      return;
    }

    this.errorMensaje = '';
    this.exitoMensaje = '';
    this.isLoading = true;

    try {

      await firstValueFrom(
        this.http.put(
          'http://localhost:8080/api/auth/recuperar-password',
          {
            idUsuario:
              this.idUsuario.trim(),
            respuesta:
              this.respuesta.trim(),
            password:
              this.passwordNueva,
          }
        )
      );

      this.exitoMensaje =
        'Contraseña actualizada correctamente.';

      this.paso = 4;

    } catch {

      this.errorMensaje =
        'No fue posible actualizar la contraseña. Verifica que cumpla con la política de seguridad.';

    } finally {

      this.isLoading = false;
    }
  }
}