import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../../shared/dynamic-table/dynamic-table.component';
import { CollapsedCardComponent } from '../../../../shared/collapsed-card/collapsed-card.component';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { LoaderComponent } from '../../../../shared/loader/loader.component';
import { DynamicField } from '../../../../interface/dynamic-field.interface';
import { PeriodoPlanillaService } from '../../../../core/services/periodo-planilla.service';

@Component({
  selector: 'app-calculo-planilla-periodo',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DynamicTableComponent, 
    CollapsedCardComponent, 
    DynamicFormComponent, 
    LoaderComponent
  ],
  templateUrl: './calculo-planilla-periodo.component.html',
  styleUrl: './calculo-planilla-periodo.component.css'
})
export class CalculoPlanillaPeriodoComponent extends BaseComponent implements OnInit {
  private periodoPlanillaService = inject(PeriodoPlanillaService);

  modeloFormulario: any = {};
  periodos: any[] = [];
  isUpdate: boolean = false;
  
  configuracionCampos: DynamicField[] = [
    { name: 'anio', label: 'Año', type: 'number', required: true, colSpan: 6 },
    { name: 'mes', label: 'Mes', type: 'number', required: true, colSpan: 6 },
    { name: 'fechaInicio', label: 'Fecha Inicio', type: 'date', required: true, colSpan: 6 },
    { name: 'fechaFin', label: 'Fecha Fin', type: 'date', required: true, colSpan: 6 }
  ];

  columnasTabla: TableColumn[] = [
    { field: 'anio', header: 'Año' },
    { field: 'mes', header: 'Mes' },
    { field: 'fechaInicio', header: 'Fecha Inicio' },
    { field: 'fechaFin', header: 'Fecha Fin' },
    { field: 'usuarioCreacion', header: 'Creado Por' },
    { field: 'fechaCreacion', header: 'Fecha Creación' }
  ];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      this.cargarPeriodos();
    });
  }

  cargarPeriodos() {
    this.executeService({
      callback: async () => {
        const response = await this.periodoPlanillaService.getPeriodos();
        this.periodos = response.data || [];
      }
    });
  }

  seleccionarRegistro(item: any) {
    this.isUpdate = true;
    this.modeloFormulario = { ...item };
    
    // Deshabilitar la llave primaria en edición
    this.findToItemField(this.configuracionCampos, 'anio').disabled = true;
    this.findToItemField(this.configuracionCampos, 'mes').disabled = true;
  }

  guardarRegistro() {
    this.executeService({
      callback: async () => {
        if (this.isUpdate) {
          await this.periodoPlanillaService.updatePeriodo(this.modeloFormulario.anio, this.modeloFormulario.mes, this.modeloFormulario);
        } else {
          await this.periodoPlanillaService.createPeriodo(this.modeloFormulario);
        }
        this.showSuccessAlert(this.isUpdate ? 'Registro actualizado exitosamente.' : 'Registro guardado exitosamente.');
        this.cargarPeriodos();
        this.limpiarFormulario();
      },
      showLoading: true
    });
  }

  eliminarRegistro() {
    this.showAlertConfirm(() => {
      this.executeService({
        callback: async () => {
          await this.periodoPlanillaService.deletePeriodo(this.modeloFormulario.anio, this.modeloFormulario.mes);
          this.showSuccessAlert('Registro eliminado exitosamente.');
          this.cargarPeriodos();
          this.limpiarFormulario();
        },
        showLoading: true
      });
    }, '¿Está seguro de eliminar este periodo?', 'Eliminar');
  }

  limpiarFormulario() {
    this.modeloFormulario = {};
    this.isUpdate = false;
    this.findToItemField(this.configuracionCampos, 'anio').disabled = false;
    this.findToItemField(this.configuracionCampos, 'mes').disabled = false;
  }
}
