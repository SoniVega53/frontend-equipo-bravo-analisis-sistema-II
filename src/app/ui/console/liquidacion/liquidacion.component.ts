import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LiquidacionService } from '../../../core/services/liquidacion.service';
import { Liquidacion } from '../../../interface/liquidacion.interface';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DropdownSelectComponent } from '../../../shared/dropdown-select/dropdown-select.component';
import { LiquidacionProcesarComponent } from './liquidacion-procesar/liquidacion-procesar.component';
import { LiquidacionHistorialComponent } from './liquidacion-historial/liquidacion-historial.component';

@Component({
  selector: 'app-liquidacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    CollapsedCardComponent,
    LoaderComponent,
    DynamicFormComponent,
    DropdownSelectComponent,
    LiquidacionProcesarComponent,
    LiquidacionHistorialComponent
],
  templateUrl: './liquidacion.component.html',
  styleUrl: './liquidacion.component.css'
})
export class LiquidacionComponent extends BaseComponent implements OnInit {
  activeTab: 'procesar' | 'historial' = 'procesar';
  private liquidacionService = inject(LiquidacionService);

  modeloFormulario: any = {};
  datosTabla: Liquidacion[] = [];
  columnasTabla: TableColumn[] = [];
  currentPage: number = 1;
  empleadoSeleccionado: number | null = null;

  campoEmpleado: DynamicField = {
    name: 'idEmpleado',
    label: 'Seleccionar Empleado',
    type: 'dropdown',
    required: true,
    options: []
  };

  searchTerm: any;

  configuracionCampos: DynamicField[] = [
    { name: 'nombrePuesto', label: 'Puesto', type: 'text', required: true, colSpan: 12,disabled:true },
    { name: 'fechaContratacion', label: 'Fecha de Contratación', type: 'date', required: true, colSpan: 4 },
    { name: 'fechaEgreso', label: 'Fecha de Egreso', type: 'date', required: true, colSpan: 4 },
    { name: 'fechaLiquidacion', label: 'Fecha de Liquidación', type: 'date', required: true, colSpan: 4 },
    { name: 'motivoEgreso', label: 'Motivo de Egreso', type: 'text', required: true, colSpan: 12 },
    { name: 'ingresoSueldoBase', label: 'Sueldo Base (Q)', type: 'number', required: true, colSpan: 4 },
    { name: 'ingresoBonificacionDecreto', label: 'Bonificación Decreto (Q)', type: 'number', required: true, colSpan: 4 },
    { name: 'ingresoOtrosIngresos', label: 'Otros Ingresos (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoIgss', label: 'Descuento IGSS (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoIsr', label: 'Descuento ISR (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoInasistencias', label: 'Inasistencias (Q)', type: 'number', required: false, colSpan: 4 }
  ];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      this.configurarColumnas();
      this.cargarEmpleados();
      this.cargarDatos();
    });
  }

  configurarColumnas() {
    this.columnasTabla = [
      { field: 'idLiquidacion', header: 'ID' },
      { field: 'nombreEmpleado', header: 'Empleado' },
      { field: 'nombrePuesto', header: 'Puesto' },
      { field: 'fechaEgreso', header: 'F. Egreso' },
      { field: 'totalNeto', header: 'Total Liquidado (Q)' }
    ];
  }

  cargarEmpleados() {
    this.executeService({
      callback: async () => {
        this.campoEmpleado.options = await this.catalogoService.getEmpleados();
      },
      showLoading: false
    });
  }

  cargarDatos() {
    this.executeService({
      callback: async () => {
        const datos = await this.liquidacionService.obtenerTodas();
        this.datosTabla = this.ordenarGenerico(datos, '', 'idLiquidacion', 'nombreEmpleado');
      },
      showLoading: true
    });
  }

  onEmpleadoSelected(id: number) {
    this.empleadoSeleccionado = id;
    if (!id) {
      this.limpiarFormulario();
      return;
    }

    this.executeService({
      callback: async () => {
        const liquidacionData = await this.liquidacionService.obtenerPorEmpleado(id);
        this.modeloFormulario = { ...liquidacionData };
        
        const estaProcesada = !!liquidacionData.idLiquidacion;

        // this.configuracionCampos.forEach(c => {
        //   if (estaProcesada) {
        //     c.disabled = true;
        //   } else {
        //     const camposEditables = ['fechaContratacion','fechaEgreso', 'fechaLiquidacion', 'motivoEgreso','ingresoSueldoBase','ingresoBonificacionDecreto','ingresoOtrosIngresos','descuentoIgss','descuentoIsr','descuentoInasistencias'];
        //     c.disabled = !camposEditables.includes(c.name);
        //   }
        // });

        if (estaProcesada) {
          this.showWarningAlert('Este empleado ya cuenta con una liquidación procesada.');
        }
      },
      showLoading: true
    });
  }

  async procesarLiquidacion() {
    this.executeService({
      callback: async () => {
        const payload: Liquidacion = { ...this.modeloFormulario };
        await this.liquidacionService.procesarLiquidacion(payload);
        this.showSuccessAlert('Liquidación procesada correctamente.');
        if (!payload.idLiquidacion) {
          this.limpiarFormulario();
        }else {
          this.onEmpleadoSelected(this.empleadoSeleccionado!);
        }
        
        this.cargarDatos();
      },
      showLoading: true
    });
  }

  seleccionarRegistro(item: Liquidacion) {
    this.empleadoSeleccionado = item.idEmpleado;
    this.onEmpleadoSelected(item.idEmpleado);
  }

  limpiarFormulario() {
    this.empleadoSeleccionado = null;
    this.modeloFormulario = {};
    //this.configuracionCampos.forEach(c => c.disabled = false);
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  get filteredOptions(): Liquidacion[] {
      if (!this.searchTerm) {
        return this.datosTabla;
      }
      const term = this.searchTerm.toLowerCase();
      return this.datosTabla.filter(opt => opt?.nombreEmpleado?.toLowerCase().includes(term));
  }
}