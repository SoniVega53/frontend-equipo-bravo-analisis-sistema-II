import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { PasswordPolicy } from '../../interface/password-policy';
import { DynamicField } from '../../interface/dynamic-field.interface';

@Component({
  selector: 'app-password-policy-input',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInputComponent],
  templateUrl: './password-policy-input.component.html',
  styleUrls: ['./password-policy-input.component.css']
})
export class PasswordPolicyInputComponent implements OnInit{
  
  @Input() politicaPassword!: PasswordPolicy | null;
   @Input() field: DynamicField = {
    name: 'password',
    label: 'Contraseña',
    type: 'password-policy',
   };
  @Input() isLoading: boolean = false;
  @Input() required: boolean = true;

  @Output() passwordChange = new EventEmitter<string | null>();
  
  @Output() isValid = new EventEmitter<boolean>();

  passwordNueva = '';
  confirmarPassword = '';

  ngOnInit() {
    this.isValid.emit(this.isFormValid);
  }
  
  get isFormValid(): boolean {
    if (!this.politicaPassword) return this.passwordNueva.length > 0 && !this.passwordsMismatch;
    return this.cumpleLargo && this.cumpleRegex && !this.passwordsMismatch && this.passwordNueva.length > 0;
  }

  get passwordsMismatch(): boolean {
    return this.confirmarPassword.length > 0 && this.passwordNueva !== this.confirmarPassword;
  }

  get cumpleLargo(): boolean {
    if (!this.politicaPassword) return true;
    return this.passwordNueva.length >= (this.politicaPassword.largoMinimo || 8);
  }

  get cumpleRegex(): boolean {
    if (!this.politicaPassword?.regex || this.passwordNueva.length === 0) return true;
    return new RegExp(this.politicaPassword.regex).test(this.passwordNueva);
  }
  
  onPasswordChange() {
    const valid = 
      this.passwordNueva.length > 0 &&
      this.confirmarPassword.length > 0 &&
      this.isFormValid;
    this.isValid.emit(valid);
    
    if (valid) {
      this.passwordChange.emit(this.passwordNueva);
    } else {
      this.passwordChange.emit(null);
    }
  }
}