import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { CustomDateInputComponent } from '../../../shared/custom-date-input/custom-date-input.component';
import { DropdownSelectComponent } from '../../../shared/dropdown-select/dropdown-select.component';
import { ReportePlanillaService } from '../../../core/services/reporte-planilla.service';
import { PlanillaDetalle, PlanillaResponse, ReportePlanillaRequest } from '../../../interface/reporte-planilla.interface';
import { KpiCard, KpiCardsComponent } from '../../../shared/kpi-cards/kpi-cards.component';

@Component({
  selector: 'app-reporte-planilla',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    CollapsedCardComponent,
    LoaderComponent,
    CustomDateInputComponent,
    DropdownSelectComponent,
    KpiCardsComponent
],
  templateUrl: './reporte-planilla.component.html',
  styleUrl: './reporte-planilla.component.css'
})
export class ReportePlanillaComponent extends BaseComponent implements OnInit {
  private reportePlanillaService = inject(ReportePlanillaService);

  modeloDate: any;
  searchTerm: any;
  resumenPlanilla: PlanillaResponse | null = null;
  detallesPlanilla: PlanillaDetalle[] = [];

  currentPage: number = 1;
  kpisLiquidacion: KpiCard[] = [];

  fieldDate: DynamicField = {
    name: 'periodoSeleccionado',
    label: 'Período de Planilla (Mes y Año)',
    type: 'dropdown',
    required: true,
    colSpan: 12,
    options: []
  };

  columnasDetalle: TableColumn[] = [];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      this.configurarColumnas();
      this.cargarPeriodosDropdown();
    });
  }

  async cargarPeriodosDropdown() {
    this.executeService({
      callback: async () => {
        const periodos = await this.catalogoService.getPeriodosPlanilla();
        this.fieldDate.options = periodos;
      }
    });
  }

  actionMonthSelected(event: string) {
    this.consultarReporte();
  }

  configurarColumnas() {
    this.columnasDetalle = [
      { field: 'idEmpleado', header: 'ID Empleado' },
      {
        field: 'nombres',
        header: 'Empleado/Fecha Contratación',
        type: 'audit',
        userField: 'nombres',
        dateField: 'fechaContratacion',
      },

      { field: 'puesto', header: 'Puesto' },
      { field: 'status', header: 'Estado' },
      { field: 'ingresoSueldoBase', header: 'Base' },
      { field: 'ingresoBonificacionDecreto', header: 'Bono' },
      { field: 'ingresoOtrosIngresos', header: 'Otros' },
      { field: 'descuentoIgss', header: 'IGSS' },
      { field: 'descuentoIsr', header: 'ISR' },
      { field: 'descuentoInasistencias', header: 'Faltas' },
      { field: 'salarioNeto', header: 'Neto a Pagar' }
    ];
  }

  onSearchChange() {
    this.currentPage = 1;
  }

  get filteredOptions(): PlanillaDetalle[] {
    if (!this.searchTerm) {
      return this.detallesPlanilla;
    }
    const term = this.searchTerm.toLowerCase();
    return this.detallesPlanilla.filter(opt => opt?.nombres?.toLowerCase().includes(term));
  }

  async consultarReporte() {
    this.executeService({
      callback: async () => {
        if (!this.modeloDate) return;

        const [anioStr, mesStr] = this.modeloDate.split('-');
        const request: ReportePlanillaRequest = {
          anio: parseInt(anioStr, 10),
          mes: parseInt(mesStr, 10)
        };

        const response = await this.reportePlanillaService.generarReporte(request);
        this.resumenPlanilla = response;
        this.detallesPlanilla = this.ordenarGenerico(response.detalles || [], '', 'idEmpleado', 'nombres');
        this.actualizarKpis();
      },
      callbackError: async (error) => {
        this.limpiarFormulario();
        this.showErrorAlert(error?.mensaje || 'No hay planilla procesada para el periodo seleccionado.');
      },
      showLoading: true
    });
  }

  actualizarKpis() {
    this.kpisLiquidacion = [
      {
        title: 'Empleados',
        value: this.detallesPlanilla.length || 0,
        currency: '',
        icon: 'bi-people-fill',
        type: 'text',
        colorClass: 'success'
      },
      {
        title: 'Total Ingresos',
        value: this.resumenPlanilla?.totalIngresos || 0,
        currency: 'Q',
        icon: 'bi-graph-up-arrow',
        colorClass: 'success'
      },
      {
        title: 'Total Descuentos',
        value: this.resumenPlanilla?.totalDescuentos || 0,
        currency: 'Q',
        icon: 'bi-graph-down-arrow',
        colorClass: 'danger'
      },
      {
        title: 'Salario Neto',
        value: this.resumenPlanilla?.salarioNeto || 0,
        currency: 'Q',
        icon: 'bi-wallet2',
        colorClass: 'primary',
        isHighlight: true
      }
    ];
  }

  async descargarPdf() {
    this.executeService({
      callback: async () => {
        if (!this.modeloDate) return;

        const [anioStr, mesStr] = this.modeloDate.split('-');
        const request: ReportePlanillaRequest = {
          anio: parseInt(anioStr, 10),
          mes: parseInt(mesStr, 10)
        };

        const blob = await this.reportePlanillaService.generarPdf(request);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_planilla_${request.anio}_${request.mes}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      callbackError: async (error) => {
        this.showErrorAlert('Ocurrió un error al generar el PDF.');
      },
      showLoading: true
    });
  }

  async imprimirPdf() {
    this.executeService({
      callback: async () => {
        if (!this.modeloDate) return;

        const [anioStr, mesStr] = this.modeloDate.split('-');
        const request: ReportePlanillaRequest = {
          anio: parseInt(anioStr, 10),
          mes: parseInt(mesStr, 10)
        };

        const blob = await this.reportePlanillaService.generarPdf(request);
        const url = window.URL.createObjectURL(blob);
        
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
      },
      callbackError: async (error) => {
        this.showErrorAlert('Ocurrió un error al preparar el documento para impresión.');
      },
      showLoading: true
    });
  }

  limpiarFormulario() {
    this.resumenPlanilla = null;
    this.detallesPlanilla = [];
  }
}