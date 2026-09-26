import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { LiquidacionProcesarComponent } from './liquidacion-procesar/liquidacion-procesar.component';
import { LiquidacionHistorialComponent } from './liquidacion-historial/liquidacion-historial.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-liquidacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LiquidacionProcesarComponent,
    LiquidacionHistorialComponent
],
  templateUrl: './liquidacion.component.html',
  styleUrl: './liquidacion.component.css'
})
export class LiquidacionComponent extends BaseComponent implements OnInit {
  activeTab: 'procesar' | 'historial' = 'procesar';

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
    });
  }


  configuracionCampos: DynamicField[] = [
    { name: 'nombreEmpleado', label: 'Empleado', type: 'text', required: true, colSpan: 12, disabled: true },
    { name: 'nombrePuesto', label: 'Puesto', type: 'text', required: true, colSpan: 12, disabled: true },
    { name: 'idStatusEmpleado', label: 'Estado', type: 'dropdown', required: true, colSpan: 12, options: []},
    { name: 'fechaContratacion', label: 'Fecha Contratación', type: 'date', required: true, colSpan: 4 },
    { name: 'fechaEgreso', label: 'Fecha Egreso', type: 'date', required: true, colSpan: 4 },
    { name: 'fechaLiquidacion', label: 'Fecha Liquidación', type: 'date', required: true, colSpan: 4 },
    { name: 'motivoEgreso', label: 'Motivo de Egreso', type: 'text', required: true, colSpan: 12 },
    { name: 'ingresoSueldoBase', label: 'Sueldo Base (Q)', type: 'number', required: true, colSpan: 4 },
    { name: 'ingresoBonificacionDecreto', label: 'Bono Decreto (Q)', type: 'number', required: true, colSpan: 4 },
    { name: 'ingresoOtrosIngresos', label: 'Otros Ingresos (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoIgss', label: 'Desc. IGSS (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoIsr', label: 'Desc. ISR (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoInasistencias', label: 'Faltas (Q)', type: 'number', required: false, colSpan: 4 }
  ];


   columnasTabla:TableColumn[] = [
    { field: 'idLiquidacion', header: 'ID' },
    { field: 'nombreEmpleado', header: 'Empleado' },
    { field: 'fechaContratacion', header: 'F. Contratación' },
    { field: 'fechaEgreso', header: 'F. Egreso' },
    { field: 'fechaLiquidacion', header: 'F. Liquidación' },
    { field: 'motivoEgreso', header: 'Motivo' },
    { field: 'totalIngresos', header: 'Total Ingresos (Q)' },
    { field: 'totalDescuentos', header: 'Total Descuentos (Q)' },
    { field: 'totalNeto', header: 'Total Neto (Q)' },
    { field: 'salarioNeto', header: 'Salario Neto (Q)' }
  ];
}