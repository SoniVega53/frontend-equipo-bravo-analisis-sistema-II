import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../../shared/dynamic-table/dynamic-table.component';
import { CollapsedCardComponent } from '../../../../shared/collapsed-card/collapsed-card.component';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { DropdownSelectComponent } from '../../../../shared/dropdown-select/dropdown-select.component';
import { LiquidacionService } from '../../../../core/services/liquidacion.service';
import { DynamicField } from '../../../../interface/dynamic-field.interface';
import { EmpleadoBase, Liquidacion } from '../../../../interface/liquidacion.interface';
import { KpiCard, KpiCardsComponent } from '../../../../shared/kpi-cards/kpi-cards.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liquidacion-procesar',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, CollapsedCardComponent, DynamicFormComponent, DropdownSelectComponent, KpiCardsComponent],
  templateUrl: './liquidacion-procesar.component.html'
})
export class LiquidacionProcesarComponent extends BaseComponent implements OnInit {
  private liquidacionService = inject(LiquidacionService);

  modeloFormulario: any = {};
  historialEmpleado: Liquidacion[] = [];
  empleadoBase: EmpleadoBase | null = null;
  columnasTabla: TableColumn[] = [];
  empleadoSeleccionado: number | null = null;

  currentPage: number = 1;
  kpisLiquidacion: KpiCard[] = [];


  campoEmpleado: DynamicField = {
    name: 'idEmpleado', label: 'Seleccionar Empleado', type: 'dropdown', required: true, options: []
  };


  configuracionCampos: DynamicField[] = [
    { name: 'nombrePuesto', label: 'Puesto', type: 'text', required: true, colSpan: 12, disabled: true },
    { name: 'idStatusEmpleado', label: 'Estado', type: 'dropdown', required: true, colSpan: 12, options: []},
    { name: 'fechaContratacion', label: 'Fecha Contratación', type: 'date', required: true, colSpan: 4 },
    { name: 'fechaEgreso', label: 'Fecha Egreso', type: 'date', required: true, colSpan: 4 },
    { name: 'fechaLiquidacion', label: 'Fecha Proceso', type: 'date', required: true, colSpan: 4 },
    { name: 'motivoEgreso', label: 'Motivo de Egreso', type: 'text', required: true, colSpan: 12 },
    { name: 'ingresoSueldoBase', label: 'Sueldo Base (Q)', type: 'number', required: true, colSpan: 4 },
    { name: 'ingresoBonificacionDecreto', label: 'Bono Decreto (Q)', type: 'number', required: true, colSpan: 4 },
    { name: 'ingresoOtrosIngresos', label: 'Otros Ingresos (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoIgss', label: 'Desc. IGSS (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoIsr', label: 'Desc. ISR (Q)', type: 'number', required: false, colSpan: 4 },
    { name: 'descuentoInasistencias', label: 'Faltas (Q)', type: 'number', required: false, colSpan: 4 }
  ];

  async ngOnInit() {
    await this.cargarPermisos(false);
    this.columnasTabla = [
      { field: 'idLiquidacion', header: 'ID' },
      { field: 'fechaContratacion', header: 'F. Contratación' },
      { field: 'fechaEgreso', header: 'F. Egreso' },
      { field: 'fechaLiquidacion', header: 'F. Liquidación' },
      { field: 'motivoEgreso', header: 'Motivo' },
      { field: 'totalIngresos', header: 'Total Ingresos (Q)' },
      { field: 'totalDescuentos', header: 'Total Descuentos (Q)' },
      { field: 'totalNeto', header: 'Total Neto (Q)' },
      { field: 'salarioNeto', header: 'Salario Neto (Q)' }
    ];
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.executeService({
      callback: async () => {
        const empleados = await this.catalogoService.getEmpleados();
        const statusEmpleados = await this.catalogoService.getStatusEmpleados();
        this.campoEmpleado.options = this.ordenarGenerico(empleados, '', 'codigo', 'valor');

        this.findToItemField(this.configuracionCampos, 'idStatusEmpleado').options = this.ordenarGenerico(statusEmpleados, '', 'codigo', 'valor');
      }
    });
  }

  onEmpleadoSelected(id: number,isSlect: boolean = false) {
    console.log('Empleado seleccionado:', id);
    this.empleadoSeleccionado = id;
    if (!id) {
      this.limpiarFormulario();
      return;
    }
    this.executeService({
      callback: async () => {
        const empleado = await this.liquidacionService.getEmpleadoBase(id);
        const historial = await this.liquidacionService.obtenerPorEmpleadoHistorial(id);

        this.empleadoBase = empleado;
        if (!isSlect) {
          this.modeloFormulario = {...empleado};
          this.historialEmpleado = this.ordenarGenerico(historial, '', 'idLiquidacion', 'nombreEmpleado');
        }
        
      },
      showLoading: true
    });
  }

  actualizarKpis() {
    this.kpisLiquidacion = [
      {
        title: 'Salario Neto',
        value: this.modeloFormulario.salarioNeto || 0,
        currency: 'Q',
        icon: 'bi-wallet2',
        colorClass: 'success'
      },
      {
        title: 'Total Ingresos',
        value: this.modeloFormulario.totalIngresos || 0,
        currency: 'Q',
        icon: 'bi-graph-up-arrow',
        colorClass: 'success'
      },
      {
        title: 'Total Descuentos',
        value: this.modeloFormulario.totalDescuentos || 0,
        currency: 'Q',
        icon: 'bi-graph-down-arrow',
        colorClass: 'danger'
      },
      {
        title: 'Total Neto Liquidado',
        value: this.modeloFormulario.totalNeto || 0,
        currency: 'Q',
        icon: 'bi-cash-coin',
        colorClass: 'primary',
        isHighlight: true
      }
    ];
  }

  seleccionarRegistro(item: Liquidacion) {
    console.log('Registro seleccionado:', item);
    this.empleadoSeleccionado = item.idEmpleado;
    this.modeloFormulario = { ...item };
    this.actualizarKpis();
    //this.onEmpleadoSelected(item.idEmpleado,true);
  }

  async procesarLiquidacion() {
    this.executeService({
      callback: async () => {
        // if(!this.modeloFormulario.idLiquidacion && this.historialEmpleado.length > 0) {
        //   this.showErrorAlert('Ya tiene una liquidación procesada para este empleado. No se puede procesar otra liquidación.');
        //   return;
        // }
        await this.liquidacionService.procesarLiquidacion({ ...this.modeloFormulario });
        this.showSuccessAlert('Liquidación procesada correctamente.');
        this.onEmpleadoSelected(this.empleadoSeleccionado!);
      },
      showLoading: true
    });
  }

  async exportarPdf() {
    this.executeService({
      callback: async () => {
        const blob = await this.liquidacionService.generarBoletaPdf(this.modeloFormulario.idLiquidacion);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boleta_liquidacion_${this.modeloFormulario.idLiquidacion}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      showLoading: true
    });
  }

  
  async imprimir() {  
    try {
      const blob = await this.liquidacionService.generarBoletaPdf(this.modeloFormulario.idLiquidacion);
      const url = window.URL.createObjectURL(blob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.print();
      };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al preparar el documento para impresión.',
      });
    }
  }

  limpiarFormulario() {
    this.modeloFormulario = {};
    this.historialEmpleado = [];
  }

   onSearchChange() {
    this.currentPage = 1;
  }

}