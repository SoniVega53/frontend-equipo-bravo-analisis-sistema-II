import { MatDatepickerModule } from '@angular/material/datepicker';
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'custom-date-input',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDatepickerModule, 
    MatNativeDateModule
  ],
  templateUrl: './custom-date-input.component.html',
  styleUrls: ['./custom-date-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDateInputComponent),
      multi: true
    }
  ]
})
export class CustomDateInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'YYYY-MM-DD';
  @Input() iconLeft: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = "";

  value: string = '';
  parsedDate: Date | null = null;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value || '';
    if (this.value) {
      const [year, month, day] = this.value.split('-').map(Number);
      this.parsedDate = new Date(year, month - 1, day);
    } else {
      this.parsedDate = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateChange(event: any) {
    if (event.value) {
      const d = event.value;
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      
      this.value = `${year}-${month}-${day}`;
    } else {
      this.value = '';
    }
    
    this.onChange(this.value);
    this.onTouched();
  }
}