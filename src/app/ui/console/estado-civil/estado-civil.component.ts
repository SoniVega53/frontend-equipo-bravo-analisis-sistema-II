import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { EstadoCivilService } from '../../../core/services/estado-civil.service';
import { IEstadoCivil } from '../../../interface/estado-civil.interface';

@Component({
  selector: 'app-estado-civil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './estado-civil.component.html',
  styleUrl: './estado-civil.component.css',
})
export class EstadoCivilComponent extends BaseComponent implements OnInit {
  private estadoCivilService = inject(EstadoCivilService);

  estadosCiviles: IEstadoCivil[] = [];
  estadoCivilActual: IEstadoCivil = {};
  isUpdate: boolean = false;

  columnas: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      this.configurarCampos();
      await this.cargarLista();
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'nombre', label: 'Nombre del Estado Civil', type: 'text', placeholder: 'Ej: Soltero', required: true, colSpan: 7 },
    ];
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.estadoCivilService.getEstadoCivil();
        this.estadosCiviles = Array.isArray(data) ? data : [];
        this.columnas = [
          { field: 'idEstadoCivil', header: 'ID' },
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
    if (!this.estadoCivilActual?.nombre?.trim()) return;

    this.executeService({
      callback: async () => {
        await this.estadoCivilService.crearToActualizar(this.estadoCivilActual);

        this.showSuccessAlert(this.isUpdate ? 'Se Actualizó Correctamente' : 'Se Guardó Correctamente');
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.estadoCivilActual?.idEstadoCivil) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.estadoCivilService.eliminar(this.estadoCivilActual.idEstadoCivil!);
          this.limpiarFormulario();
          this.showSuccessAlert('El estado civil ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este estado civil');
  }

  seleccionarParaEditar(item: any) {
    this.isUpdate = true;
    this.estadoCivilActual = { ...item };
  }

  limpiarFormulario() {
    this.estadoCivilActual = {};
    this.isUpdate = false;
  }
}
