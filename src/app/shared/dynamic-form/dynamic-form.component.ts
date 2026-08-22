import { Component, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { DropdownSelectComponent } from '../dropdown-select/dropdown-select.component';
import { MultiComboBoxComponent } from '../multi-combo-box/multi-combo-box.component';
import { CustomDateInputComponent } from '../custom-date-input/custom-date-input.component';
import { DynamicField } from '../../interface/dynamic-field.interface';
import { PasswordPolicyInputComponent } from "../password-policy-input/password-policy-input.component";

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomInputComponent,
    DropdownSelectComponent,
    MultiComboBoxComponent,
    CustomDateInputComponent,
    PasswordPolicyInputComponent
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit {
  @ViewChild('dynamicForm') dynamicForm!: NgForm;

  @Input() fields: DynamicField[] = [];
  @Input() model: any = {};
  @Input() isLoading: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showCancel: boolean = false;
  @Input() showSave: boolean = false;

  @Input() saveText: string = 'Guardar';
  @Input() deleteText: string = 'Eliminar';
  @Input() cancelText: string = 'Cancelar';

  @Output() save = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  customValidations: { [key: string]: boolean } = {};

  onSubmit() {
    this.save.emit(this.model);
  }

  onDelete() {
    this.delete.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onHiddenCancel() {
    return !this.showDelete && !this.showSave;
  }

  selectionChange(event: any, field: DynamicField) {
    field.onChange?.emit(event);
  }

  ngOnInit() {

  }

  onCustomValidationChange(isValid: boolean, field: DynamicField) {
    this.customValidations[field.name] = isValid;
  }

  get isFormValid(): boolean {
    const isNgFormValid = this.dynamicForm ? this.dynamicForm.valid : false;

    const areCustomFieldsValid = this.fields
      .filter(field => !field.hidden && field.type === 'password-policy')
      .every(field => {
        if (field.required) {
          return this.customValidations[field.name] === true;
        }
        return this.customValidations[field.name] !== false;
      });

    return (isNgFormValid && areCustomFieldsValid) || false;
  }
}