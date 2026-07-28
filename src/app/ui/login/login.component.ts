import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../base.component';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,CustomInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends BaseComponent {
  idUsuario = '';
  password = '';
  showPassword = false;
  loadData = true;

  constructor() {
    super();
  }

  async onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await this.authService.login({
        idUsuario: this.idUsuario,
        password: this.password,
      });

      this.showSuccessAlert(response.mensaje || 'Inicio Correcto');

      this.navigateTo('/home', { test: true });
    } catch (err: any) {
      console.error(err);
      this.showErrorAlert(err.mensaje || 'Error al iniciar servicio');
    } finally {
      this.isLoading = false;
    }
  }

  onForgotPassword() {
    console.log("CLICK")
    // this.navigateTo('/recuperar-password');
  }
}
