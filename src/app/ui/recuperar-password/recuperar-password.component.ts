import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { BaseComponent } from '../base.component';
import { PasswordPolicy } from '../../interface/password-policy';

@Component({
  selector: 'recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent extends BaseComponent {
  paso = 1;
  idUsuario = '';
  pregunta = '';
  respuesta = '';
  passwordNueva = '';
  confirmarPassword = '';
  
  politicaPassword: PasswordPolicy = {
    regex: '',
    mensajeValidacion: '',
    largoMinimo: 8,
  };

  errorMensaje = '';
  exitoMensaje = '';

  async buscarUsuario() {
    if (!this.idUsuario) return;
    this.errorMensaje = '';

    await this.executeService({
      callback: async () => {
        const response = await this.authService.obtenerPreguntaSeguridad(this.idUsuario);
        if (response && response.pregunta) {
          this.pregunta = response.pregunta;
          this.politicaPassword = response.politica || this.politicaPassword;
          this.paso = 2;
        }
      },
      callbackError: (error) => {
        this.errorMensaje = error?.mensaje || 'Usuario no encontrado o sin pregunta configurada.';
      }
    },false);
  }

  async validarRespuesta() {
    if (!this.respuesta) return;
    this.errorMensaje = '';

    await this.executeService({
      callback: async () => {
        await this.authService.validarRespuestaSeguridad(this.idUsuario, this.respuesta);
        this.paso = 3;
      },
      callbackError: (error) => {
        this.errorMensaje = error?.mensaje || 'Respuesta incorrecta.';
      }
    },false);
  }

  async cambiarPassword() {
    if (!this.isFormValid) return;
    this.errorMensaje = '';
    this.exitoMensaje = '';

    await this.executeService({
      callback: async () => {
        await this.authService.cambiarPasswordRecuperacion(this.idUsuario, this.passwordNueva,this.respuesta);
        this.exitoMensaje = 'Contraseña actualizada correctamente.';

        const response = await this.authService.login({
          idUsuario: this.idUsuario,
          password: this.passwordNueva,
        });
        this.showSuccessAlert(this.exitoMensaje);

        setTimeout(() => {
          this.navigateTo('/home', { changePassword: response.changePassword == 1 });
        }, 2000);

       // this.router.navigate(['/login']);
      },
      callbackError: (error) => {
        this.errorMensaje = error?.mensaje || 'Error al actualizar la contraseña.';
      }
    },false);
  }

  get isFormValid(): boolean {
    const cumpleRegex = this.politicaPassword.regex
      ? new RegExp(this.politicaPassword.regex).test(this.passwordNueva)
      : true;
    return (
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

  volverInicio() {
    this.router.navigate(['/login']);
  }
}