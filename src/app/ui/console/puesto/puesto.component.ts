import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { SelectOption } from '../../../interface/select-option.interface';
import { PuestoService } from '../../../core/services/puesto.service';
import { IPuesto } from '../../../interface/puesto.interface';

@Component({
  selector: 'app-puesto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './puesto.component.html',
  styleUrl: './puesto.component.css',
})
export class PuestoComponent extends BaseComponent implements OnInit {
  private puestoService = inject(PuestoService);

  puestos: IPuesto[] = [];
  puestoActual: IPuesto = {};
  isUpdate: boolean = false;

  optionsDepartamento: SelectOption[] = [];
  columnas: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarCatalogosPrincipales();
      this.configurarCampos();
      await this.cargarLista();
    });
  }

  async cargarCatalogosPrincipales() {
    this.executeService({
      callback: async () => {
        this.optionsDepartamento = await this.catalogoService.getDepartamentos();
        this.configurarCampos();
      },
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'idDepartamento', label: 'Departamento', type: 'dropdown', required: true, colSpan: 6, options: this.optionsDepartamento },
      { name: 'nombre', label: 'Nombre del Puesto', type: 'text', placeholder: 'Ej: Analista de Nómina', required: true, colSpan: 6 },
    ];
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.puestoService.getPuesto();
        this.puestos = Array.isArray(data) ? data : [];
        this.columnas = [
          { field: 'idPuesto', header: 'ID' },
          { field: 'idDepartamento', header: 'ID Departamento' },
          { field: 'nombre', header: 'Nombre' },
          {
            field: 'creacion',
            header: 'Creación',
            type: 'audit',
            userField: 'usuarioCreacion',
            dateField: 'fechaCreacion',
          },
          {
            field: 'modificacion',
            header: 'Modificación',
            type: 'audit',
            userField: 'usuarioModificacion',
            dateField: 'fechaModificacion',
          },
        ];
      },
    });
  }

  async guardar() {
    if (!this.puestoActual?.nombre?.trim()) return;

    this.executeService({
      callback: async () => {
        await this.puestoService.crearToActualizar(this.puestoActual);

        this.showSuccessAlert(this.isUpdate ? 'Se Actualizó Correctamente' : 'Se Guardó Correctamente');
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.puestoActual?.idPuesto) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.puestoService.eliminar(this.puestoActual.idPuesto!);
          this.limpiarFormulario();
          this.showSuccessAlert('El puesto ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este puesto');
  }

  seleccionarParaEditar(item: any) {
    this.isUpdate = true;
    this.puestoActual = { ...item };
  }

  limpiarFormulario() {
    this.puestoActual = {};
    this.isUpdate = false;
  }
}
