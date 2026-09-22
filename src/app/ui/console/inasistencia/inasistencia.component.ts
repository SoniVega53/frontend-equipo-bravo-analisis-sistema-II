import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { SelectOption } from '../../../interface/select-option.interface';
import { InasistenciaService } from '../../../core/services/inasistencia.service';
import { Inasistencia } from '../../../interface/inasistencia.interface';
import { DropdownSelectComponent } from '../../../shared/dropdown-select/dropdown-select.component';

@Component({
  selector: 'app-inasistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    CollapsedCardComponent,
    LoaderComponent,
    DropdownSelectComponent
],
  templateUrl: './inasistencia.component.html',
  styleUrl: './inasistencia.component.css'
})
export class InasistenciaComponent extends BaseComponent implements OnInit {
   private inasistenciaService = inject(InasistenciaService);


  inasistencias: Inasistencia[] = [];
  inasistenciaActual: Inasistencia = {};
  isUpdate: boolean = false;

  optionsEmpleado: SelectOption[] = [];
  columnasInasistencias: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];
  isFormCollapsed: boolean = true;

  fieldEmpleado: DynamicField = {
        name: 'idEmpleado',
        label: 'Empleado',
        type: 'dropdown',
        required: true,
        colSpan: 12,
        options: []
  };

  modelEmpleado:any;

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarCatalogosPrincipales();
      //await this.cargarLista();
    });
  }

  async cargarCatalogosPrincipales() {
    this.executeService({
      callback: async () => {
        const empleados: SelectOption[] = await this.catalogoService.getEmpleados();
        this.optionsEmpleado = empleados;
        this.fieldEmpleado.options = empleados;
        this.configurarCampos();
      }
    });
  }


  selectionChange(event:any){
    this.cargarListaEmpleadoIna();
  }

  configurarCampos() {
    this.configuracionCampos = [
      {
        name: 'fechaInicio',
        label: 'Fecha Inicio',
        type: 'date',
        required: true,
        colSpan: 6
      },
      {
        name: 'fechaFin',
        label: 'Fecha Fin',
        type: 'date',
        required: true,
        colSpan: 6
      },
      {
        name: 'motivoInasistencia',
        label: 'Motivo de Inasistencia',
        type: 'textarea',
        required: true,
        colSpan: 12
      },
      {
        name: 'fechaProcesado',
        label: 'Fecha de Procesamiento',
        type: 'date',
        required: false,
        disabled: true,
        hidden:true,
        colSpan: 12
      }
    ];
  }

  async cargarListaEmpleadoIna() {
    if (!this.modelEmpleado) return;
    this.executeService({
      callback: async () => {
        this.limpiarFormulario();
        this.isFormCollapsed = true;

        const data: Inasistencia[] = await this.inasistenciaService.getInasistenciasPorEmpleado(this.modelEmpleado);
        this.inasistencias = Array.isArray(data) ? data : [];
        this.columnasInasistencias = [
          { field: 'idInasistencia', header: 'ID' },
          { field: 'nombreEmpleado', header: 'Empleado' },
          { field: 'fechaInicio', header: 'Fecha Inicio' },
          { field: 'fechaFin', header: 'Fecha Fin' },
          { field: 'motivoInasistencia', header: 'Motivo' },
          { field: 'fechaProcesado', header: 'Fecha Procesado' },
          {
            field: 'fechaCreacion',
            header: 'Creación',
            type: 'audit',
            userField: 'usuarioCreacio',
            dateField: 'fechaCreacion'
          }
        ];
      }
    });
  }

  async guardar() {
    this.executeService({
      callback: async () => {
        if (!this.inasistenciaActual && !this.modelEmpleado) return;

        this.inasistenciaActual.idEmpleado = this.modelEmpleado;

        if (this.isUpdate && this.inasistenciaActual.idInasistencia) {
          await this.inasistenciaService.actualizarInasistencia(
            this.inasistenciaActual.idInasistencia,
            this.inasistenciaActual
          );
          this.showSuccessAlert('Se actualizó la inasistencia correctamente.');
        } else {
          await this.inasistenciaService.crearInasistencia(this.inasistenciaActual);
          this.showSuccessAlert('Se registró la inasistencia correctamente.');
        }

        this.limpiarFormulario();
        await this.cargarListaEmpleadoIna();
      },
      showLoading: true
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.inasistenciaActual.idInasistencia) return;

    if (this.inasistenciaActual.procesado) {
      this.showErrorAlert('No se puede eliminar una inasistencia que ya ha sido procesada en la planilla.');
      return;
    }

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.inasistenciaService.eliminarInasistencia(this.inasistenciaActual.idInasistencia!);
          this.limpiarFormulario();
          this.showSuccessAlert('La inasistencia ha sido eliminada correctamente.');
          await this.cargarListaEmpleadoIna();
        },
        showLoading: true
      });
    }, 'esta inasistencia');
  }

  seleccionarParaEditar(item: Inasistencia) {
    if (item.procesado) {
      this.showWarningAlert('Esta inasistencia ya fue procesada en planilla y no puede ser modificada.');
      return;
    }

    this.findToItemField(this.configuracionCampos,'fechaProcesado').hidden = false;

    this.isUpdate = true;
    this.isFormCollapsed = false;
    this.inasistenciaActual = { ...item };
  }

  limpiarFormulario() {
    this.inasistenciaActual = {};
    this.isUpdate = false;
    this.findToItemField(this.configuracionCampos,'fechaProcesado').hidden = true;
  }

  onFormCollapsed(even:boolean){
    this.isFormCollapsed = even;
  }
}