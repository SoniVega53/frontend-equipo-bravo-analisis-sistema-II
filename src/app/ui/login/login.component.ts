import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../base.component';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends BaseComponent {
  idUsuario = '';
  password = '';
  showPassword = false;

  constructor() {
    super();
  }

  async onLogin() {
    this.executeService({
      callback: async () => {
        const response = await this.authService.login({
          idUsuario: this.idUsuario,
          password: this.password,
        });
        this.showSuccessAlert(response.mensaje || 'Inicio Correcto');
        this.navigateTo('/home', { changePassword: response.changePassword == 1 });
      },
      showLoading: false,
    },false);
  }

  onForgotPassword() {
    console.log('CLICK');
    // this.navigateTo('/recuperar-password');
  }
}
