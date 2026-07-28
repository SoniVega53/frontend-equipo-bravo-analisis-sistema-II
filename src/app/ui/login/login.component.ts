import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent extends BaseComponent implements OnInit {
  idUsuario = '';
  password = '';
  loadData = true;

  isAlreadyLoggedIn = false;

  constructor(
    private authService: AuthService,
  ) {
    super()
    if (this.authService.isLoggedIn()) {
      this.isAlreadyLoggedIn = true;
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    
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

      this.navigateTo('/home', {  test: true });
      
    } catch (err: any) {
      console.error(err);
      this.showErrorAlert(err.mensaje || 'Error al iniciar servicio');
    } finally {
      this.isLoading = false;
    }
  }
}
