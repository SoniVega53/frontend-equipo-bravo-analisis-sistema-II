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
    DropdownSelectComponent
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
    this.procesar(false);
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

  onClickAction(){
    this.procesar(true);
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

  async procesar(forzarRecalculo:boolean) {
    this.isActualizar = false;
    this.isProcesar = false;
    this.executeService({
      callback: async () => {
        if (!this.modeloDate) return;

        const [anioStr, mesStr] = this.modeloDate.split('-');
        
        const request: PlanillaRequest = {
          anio: parseInt(anioStr, 10),
          mes: parseInt(mesStr, 10),
          forzarRecalculo: forzarRecalculo
        };

        const response = await this.calculoPlanillaService.procesarOObtenerPlanilla(request);
        this.resumenPlanilla = response;

        this.detallesPlanilla =  this.ordenarGenerico(response.detalles || [], '', 'idEmpleado', 'nombres');
        
        if (forzarRecalculo) {
          this.showSuccessAlert('La planilla se procesó/consultó correctamente.');
        }
        this.isActualizar = true;
        this.textButton = 'Actualizar Planilla';
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