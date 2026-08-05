import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../interface/select-option.interface';

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownSelectComponent),
      multi: true
    }
  ]
})
export class DropdownSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccione...';
  @Input() iconLeft: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = "";
  @Input() options: SelectOption[] = [];
  
  @Output() selectionChange = new EventEmitter<any>();

  isOpen: boolean = false;
  value: any = null;

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (!this.isOpen) this.onTouched();
    }
  }

  selectOption(option: SelectOption, event: Event) {
    event.stopPropagation();
    if (this.disabled) return;

    this.value = option.codigo;
    this.isOpen = false;
    
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  isSelected(option: SelectOption): boolean {
    return this.value === option.codigo;
  }

  hasSelection(): boolean {
    return this.value !== null && this.value !== undefined && this.value !== '';
  }

  get displayValue(): string {
    if (!this.hasSelection()) return '';
    const selectedOption = this.options.find(opt => opt.codigo === this.value);
    return selectedOption ? selectedOption.valor : '';
  }

  getSelected(): SelectOption | null {
    if (!this.hasSelection()) return null;
    return this.options.find(opt => opt.codigo === this.value) || null;
  }

  writeValue(value: any): void {
    this.value = value;
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
}