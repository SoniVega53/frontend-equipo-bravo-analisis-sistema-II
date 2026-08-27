import { EventEmitter } from '@angular/core';
import { SelectOption } from './select-option.interface';
import { PasswordPolicy } from './password-policy';

export type DynamicFieldType = 'text' | 'password' | 'email' | 'number' | 'dropdown' | 'multiselect' | 'email' | 'number' | 'date' | 'password-policy';

export interface DynamicField {
  name: string;
  label: string;
  type: DynamicFieldType;
  placeholder?: string;
  iconLeft?: string;
  iconRight?: string;
  policyData?: PasswordPolicy;
  hidden?: boolean;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  colSpan?: number;
  onChange?: EventEmitter<any>;
}