import { Component } from '@angular/core';
import { SelectOption } from '../../../interface/select-option.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownSelectComponent } from '../../../shared/dropdown-select/dropdown-select.component';
import { MultiComboBoxComponent } from '../../../shared/multi-combo-box/multi-combo-box.component';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule,DropdownSelectComponent,MultiComboBoxComponent],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
})
export class EmpresaComponent {
  sucursalSeleccionada: string | number = '';
  sucursales: SelectOption[] = [
    { codigo: 'SUC-01', valor: 'Sucursal Central' },
    { codigo: 'SUC-02', valor: 'Sucursal Norte' },
    { codigo: 'SUC-03', valor: 'Sucursal Sur' },
    { codigo: 'SUC-04', valor: 'Sucursal Este' },
  ];

  rolesSeleccionados: any[] = [];
  roles: SelectOption[] = [
    { codigo: 1, valor: 'Administrador general' },
    { codigo: 2, valor: 'Supervisor de área', seleccionado: 1 },
    { codigo: 3, valor: 'Asesor de ventas' },
    { codigo: 4, valor: 'Auditor interno', seleccionado: 1 },
    { codigo: 5, valor: 'Soporte técnico' },
  ];
}
