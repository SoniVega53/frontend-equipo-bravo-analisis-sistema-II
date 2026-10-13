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
import { DepartamentoService } from '../../../core/services/departamento.service';
import { IDepartamento } from '../../../interface/departamento.interface';

@Component({
  selector: 'app-departamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './departamento.component.html',
  styleUrl: './departamento.component.css',
})
export class DepartamentoComponent extends BaseComponent implements OnInit {
  private departamentoService = inject(DepartamentoService);

  departamentos: IDepartamento[] = [];
  departamentoActual: IDepartamento = {};
  isUpdate: boolean = false;

  optionsEmpresa: SelectOption[] = [];
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
        this.optionsEmpresa = await this.catalogoService.getEmpresas();
        this.configurarCampos();
      },
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'idEmpresa', label: 'Empresa', type: 'dropdown', required: true, colSpan: 6, options: this.optionsEmpresa },
      { name: 'nombre', label: 'Nombre del Departamento', type: 'text', placeholder: 'Ej: Recursos Humanos', required: true, colSpan: 6 },
    ];
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.departamentoService.getDepartamento();
        this.departamentos = Array.isArray(data) ? data : [];
        this.columnas = [
          { field: 'idDepartamento', header: 'ID' },
          { field: 'idEmpresa', header: 'ID Empresa' },
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
    if (!this.departamentoActual?.nombre?.trim()) return;

    this.executeService({
      callback: async () => {
        await this.departamentoService.crearToActualizar(this.departamentoActual);

        this.showSuccessAlert(this.isUpdate ? 'Se Actualizó Correctamente' : 'Se Guardó Correctamente');
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.departamentoActual?.idDepartamento) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.departamentoService.eliminar(this.departamentoActual.idDepartamento!);
          this.limpiarFormulario();
          this.showSuccessAlert('El departamento ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este departamento');
  }

  seleccionarParaEditar(item: any) {
    this.isUpdate = true;
    this.departamentoActual = { ...item };
  }

  limpiarFormulario() {
    this.departamentoActual = {};
    this.isUpdate = false;
  }
}
