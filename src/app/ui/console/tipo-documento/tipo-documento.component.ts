import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoDocumentoService } from '../../../core/services/tipo-documento.service';
import { TipoDocumento } from '../../../interface/tipo-documento.interface';
import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';

@Component({
  selector: 'app-tipo-documento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './tipo-documento.component.html',
  styleUrl: './tipo-documento.component.css',
})
export class TipoDocumentoComponent extends BaseComponent implements OnInit {
  private tipoDocumentoService = inject(TipoDocumentoService);

  tiposDocumento: TipoDocumento[] = [];
  tipoDocumentoActual: TipoDocumento = { nombre: '' };

  columnasTiposDocumento: TableColumn[] = [];

  configuracionCampos: DynamicField[] = [
    {
      name: 'idTipoDocumento',
      label: 'ID Tipo Documento',
      type: 'text',
      placeholder: 'idTipoDocumento',
      disabled: true,
      colSpan: 7,
      hidden: true,
    },
    {
      name: 'nombre',
      label: 'Nombre del Tipo de Documento',
      type: 'text',
      placeholder: 'Ej: DPI',
      required: true,
      colSpan: 7,
    },
  ];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarLista();
    });
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: any = await this.tipoDocumentoService.getTipoDocumento();
        this.tiposDocumento = Array.isArray(data) ? data : [];
        this.columnasTiposDocumento = [
          { field: 'idTipoDocumento', header: 'ID' },
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

  async guardar(data: any) {
    if (!this.tipoDocumentoActual.nombre) return;

    this.executeService({
      callback: async () => {
        await this.tipoDocumentoService.crearToActualizar(this.tipoDocumentoActual);

        const update = this.tipoDocumentoActual.idTipoDocumento;

        this.showSuccessAlert(
          update ? 'Se Actualizo Correctamente' : 'Se Guardo Correctamente',
        );

        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar(id?: number) {
    if (!id) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.tipoDocumentoService.eliminar(id);

          if (this.tipoDocumentoActual.idTipoDocumento === id) {
            this.limpiarFormulario();
          }

          this.showSuccessAlert('El tipo de documento ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este tipo de documento');
  }

  seleccionarParaEditar(tipoDocumento: TipoDocumento) {
    this.tipoDocumentoActual = { ...tipoDocumento };

    if (this.tipoDocumentoActual.idTipoDocumento) {
      this.findToItemField(this.configuracionCampos, 'idTipoDocumento').hidden = false;
    }
  }

  limpiarFormulario() {
    this.tipoDocumentoActual = { nombre: '' };
    this.findToItemField(this.configuracionCampos, 'idTipoDocumento').hidden = true;
  }
}