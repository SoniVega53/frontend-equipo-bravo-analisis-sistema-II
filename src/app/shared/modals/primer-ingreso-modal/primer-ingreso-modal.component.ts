import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../custom-input/custom-input.component';
import { PasswordPolicy } from '../../../interface/password-policy';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'primer-ingreso-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent, LoaderComponent],
  templateUrl: './primer-ingreso-modal.component.html',
  styleUrls: ['./primer-ingreso-modal.component.css'],
})
export class PrimerIngresoModalComponent {
  @Input() politicaPassword:PasswordPolicy = {
    regex: '',
    mensajeValidacion: 'Debe cumplir con las normas de seguridad.',
    largoMinimo: 8,
  };

  @Output() configuracionExitosa = new EventEmitter<string>();
  @Output() onSalirAlLogin = new EventEmitter<void>();
  @Input() texto:string = 'Por favor, configure su nueva contraseña.';



  passwordNueva = '';
  confirmarPassword = '';
  isLoading = false;
  errorMensaje = '';

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

  async onSubmit() {
    if (!this.isFormValid) return;

    this.isLoading = true;
    this.errorMensaje = '';

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      this.configuracionExitosa.emit(this.passwordNueva);
    } catch (error: any) {
      this.errorMensaje =
        error?.error?.message || 'Error al actualizar la contraseña.';
    } finally {
      this.isLoading = false;
    }
  }

  salirAlLogin(){
    this.onSalirAlLogin.emit();
  }
}
