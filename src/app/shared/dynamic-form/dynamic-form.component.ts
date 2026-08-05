import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { DropdownSelectComponent } from '../dropdown-select/dropdown-select.component';
import { MultiComboBoxComponent } from '../multi-combo-box/multi-combo-box.component';
import { CustomDateInputComponent } from '../custom-date-input/custom-date-input.component';
import { DynamicField } from '../../interface/dynamic-field.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomInputComponent,
    DropdownSelectComponent,
    MultiComboBoxComponent,
    CustomDateInputComponent
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent {
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

  onSubmit() {
    this.save.emit(this.model);
  }

  onDelete() {
    this.delete.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}