import { SelectOption } from './select-option.interface';

export type DynamicFieldType = 'text' | 'password' | 'email' | 'number' | 'dropdown' | 'multiselect'| 'password' | 'email' | 'number';

export interface DynamicField {
  name: string;
  label: string;
  type: DynamicFieldType;
  placeholder?: string;
  iconLeft?: string;
  iconRight?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  colSpan?: number;
}