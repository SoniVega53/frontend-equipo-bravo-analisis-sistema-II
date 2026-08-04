import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../custom-input/custom-input.component';

@Component({
  selector: 'primer-ingreso-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './primer-ingreso-modal.component.html',
  styleUrls: ['./primer-ingreso-modal.component.css']
})
export class PrimerIngresoModalComponent {
  
  @Output() configuracionExitosa = new EventEmitter<void>();
  
  passwordNueva = '';
  confirmarPassword = '';
  isLoading = false;
  errorMensaje = '';

  get isFormValid(): boolean {
    return (
      this.passwordNueva.length >= 8 &&
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

  async onSubmit() {
    if (!this.isFormValid) return;

    this.isLoading = true;
    this.errorMensaje = '';

    try {
      const dto = {
        passwordNueva: this.passwordNueva
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); 

      this.configuracionExitosa.emit();
      
    } catch (error: any) {
      this.errorMensaje = error?.error?.message || 'Error al actualizar la contraseña.';
    } finally {
      this.isLoading = false;
    }
  }
}