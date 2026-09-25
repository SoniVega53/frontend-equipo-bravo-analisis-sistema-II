import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { CalculoPlanillaService } from '../../../core/services/calculo-planilla.service';
import { PlanillaRequest, PlanillaResponse, PlanillaDetalle } from '../../../interface/calculo-planilla.interface';
import { CustomDateInputComponent } from '../../../shared/custom-date-input/custom-date-input.component';
import { DropdownSelectComponent } from '../../../shared/dropdown-select/dropdown-select.component';
import { KpiCard, KpiCardsComponent } from '../../../shared/kpi-cards/kpi-cards.component';

@Component({
  selector: 'app-calculo-planilla',
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
  templateUrl: './calculo-planilla.component.html',
  styleUrl: './calculo-planilla.component.css'
})
export class CalculoPlanillaComponent extends BaseComponent implements OnInit {
  private calculoPlanillaService = inject(CalculoPlanillaService);

 // modeloFormulario: any = {};
  modeloDate: any;
  searchTerm: any;
  resumenPlanilla: PlanillaResponse | null = null;
  detallesPlanilla: PlanillaDetalle[] = [];

  kpisLiquidacion: KpiCard[] = [];

  isProcesar: boolean = false;
  isActualizar: boolean = false;
  textButton: string = '';
  currentPage: number = 1;

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

  actionMonthSelected(event:string){
    console.log(event);
    this.procesar(false,false,true);
  }

  configurarColumnas() {
    this.columnasDetalle = [
      { field: 'idEmpleado', header: 'ID Empleado' },
      { field: 'nombres', header: 'Nombre Empleado' },
      { field: 'ingresoSueldoBase', header: 'Base' },
      { field: 'ingresoBonificacionDecreto', header: 'Bono' },
      { field: 'ingresoOtrosIngresos', header: 'Otros' },
      { field: 'descuentoIgss', header: 'IGSS' },
      { field: 'descuentoIsr', header: 'ISR' },
      { field: 'descuentoInasistencias', header: 'Faltas' },
      { field: 'salarioNeto', header: 'Neto a Pagar' }
    ];
  }

  onClickAction(isUpdate: boolean) {
     if(isUpdate) {
        this.showAlertConfirm(() => {
          this.procesar(true,isUpdate);
        }, 'Estas seguro de actualizar la planilla?', 'Confirmar Actualización');
        return;
      }
      this.procesar(true,isUpdate);
  }

  onSearchChange(){
    this.currentPage = 1;
    console.log(this.currentPage)
  }

  get filteredOptions(): PlanillaDetalle[] {
    if (!this.searchTerm) {
      return this.detallesPlanilla;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.detallesPlanilla.filter(opt => opt?.nombres?.toLowerCase().includes(term));
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

  async procesar(forzarRecalculo:boolean, isUpdate: boolean = false,isFind: boolean = false) {
    this.isActualizar = false;
    this.isProcesar = false;
    this.executeService({
      callback: async () => {
        if (!this.modeloDate) return;

        const [anioStr, mesStr] = this.modeloDate.split('-');
        
        const request: PlanillaRequest = {
          anio: parseInt(anioStr, 10),
          mes: parseInt(mesStr, 10),
          forzarRecalculo: forzarRecalculo,
          isUpdate: isUpdate,
          isFind: isFind
        };

        const response = await this.calculoPlanillaService.procesarOObtenerPlanilla(request);
        this.resumenPlanilla = response;

        this.detallesPlanilla =  this.ordenarGenerico(response.detalles || [], '', 'idEmpleado', 'nombres');
        
        if (forzarRecalculo) {
          this.showSuccessAlert('La planilla se procesó correctamente.');
        }
        this.isActualizar = true;
        this.textButton = 'Actualizar Planilla';
        this.actualizarKpis();
      },
      callbackError: async (error) => {
        this.limpiarError();
        if (error.codigoNumerico == 1400) {
          this.isProcesar = true;
          this.textButton = 'Procesar Planilla';
          return;
        }

        this.showErrorAlert(
          error?.mensaje || 'Ocurrió un error al procesar la solicitud.',
        );
      },
      showLoading: true
    });
  }

  limpiarFormulario() {
    this.modeloDate = null;
    this.resumenPlanilla = null;
    this.detallesPlanilla = [];
  }

  limpiarError() {
    this.resumenPlanilla = null;
    this.detallesPlanilla = [];
  }

}