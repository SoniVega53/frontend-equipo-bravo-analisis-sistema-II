import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../../interface/select-option.interface';

@Component({
  selector: 'app-multi-combo-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-combo-box.component.html',
  styleUrls: ['./multi-combo-box.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiComboBoxComponent),
      multi: true
    }
  ]
})
export class MultiComboBoxComponent implements ControlValueAccessor, OnChanges {
  @Input() label: string = '';
  @Input() placeholder: string = 'Seleccione...';
  @Input() iconLeft: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() options: SelectOption[] = [];
  
  @Output() selectionChange = new EventEmitter<any>();

  isOpen: boolean = false;
  value: any[] = [];

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private eRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      const preselected = this.options.filter(opt => opt.seleccionado === 1).map(opt => opt.codigo);
      
      if (preselected.length > 0) {
        const currentValues = Array.isArray(this.value) ? [...this.value] : [];
        let hasChanges = false;
        
        preselected.forEach(code => {
          if (!currentValues.includes(code)) {
            currentValues.push(code);
            hasChanges = true;
          }
        });

        if (hasChanges) {
          this.value = currentValues;
          this.onChange(this.value);
        }
      }
    }
  }

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

    const currentValues = Array.isArray(this.value) ? [...this.value] : [];
    const index = currentValues.indexOf(option.codigo);
    
    if (index === -1) {
      currentValues.push(option.codigo);
    } else {
      currentValues.splice(index, 1);
    }

    this.value = currentValues;
    this.onChange(this.value);
    this.selectionChange.emit(this.value);
  }

  isSelected(option: SelectOption): boolean {
    return Array.isArray(this.value) && this.value.includes(option.codigo);
  }

  hasSelection(): boolean {
    return Array.isArray(this.value) && this.value.length > 0;
  }

  get displayValue(): string {
    if (!this.hasSelection()) return '';
    const selectedOptions = this.options.filter(opt => this.value.includes(opt.codigo));
    return selectedOptions.map(opt => opt.valor).join(', ');
  }

  getSelected(): SelectOption[] {
    if (!this.hasSelection()) return [];
    return this.options.filter(opt => this.value.includes(opt.codigo));
  }

  writeValue(value: any): void {
    this.value = Array.isArray(value) ? value : [];
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