import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EmpresaService } from '../../../core/services/empresa.service';
import { Empresa } from '../../../interface/empresa.interface';

import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';

import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';

import { DynamicField } from '../../../interface/dynamic-field.interface';

import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.css',
})
export class EmpresaComponent extends BaseComponent implements OnInit {

  private empresaService = inject(EmpresaService);

  empresas: Empresa[] = [];

  empresaActual: Empresa = {
    nombre: '',
    direccion: '',
    nit: ''
  };

  columnasEmpresas: TableColumn[] = [];

  configuracionCampos: DynamicField[] = [

    {
      name: 'idEmpresa',
      label: 'ID Empresa',
      type: 'text',
      placeholder: 'idEmpresa',
      disabled: true,
      colSpan: 7,
      hidden: true
    },

    {
      name: 'nombre',
      label: 'Nombre de la Empresa',
      type: 'text',
      placeholder: 'Ej: Empresa ABC',
      required: true,
      colSpan: 7
    },

    {
      name: 'direccion',
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ej: Ciudad de Guatemala',
      required: true,
      colSpan: 7
    },

    {
      name: 'nit',
      label: 'NIT',
      type: 'text',
      placeholder: 'Ej: 1234567-8',
      required: true,
      colSpan: 7
    }
  ];

  async ngOnInit() {

    await this.cargarPermisos();

    await this.cargarLista();
  }

  async cargarLista() {

    this.executeService({

      callback: async () => {

        const data: any =
          await this.empresaService.getEmpresas();

        this.empresas =
          Array.isArray(data) ? data : [];

        this.columnasEmpresas = [

          {
            field: 'idEmpresa',
            header: 'ID'
          },

          {
            field: 'nombre',
            header: 'Nombre'
          },

          {
            field: 'direccion',
            header: 'Dirección'
          },

          {
            field: 'nit',
            header: 'NIT'
          },

          {
            field: 'creacion',
            header: 'Creación',
            type: 'audit',
            userField: 'usuarioCreacion',
            dateField: 'fechaCreacion'
          },

          {
            field: 'modificacion',
            header: 'Modificación',
            type: 'audit',
            userField: 'usuarioModificacion',
            dateField: 'fechaModificacion'
          }

        ];
      }

    });
  }

  async guardar(data: any) {

    if (
      !this.empresaActual.nombre ||
      !this.empresaActual.direccion ||
      !this.empresaActual.nit
    ) {
      return;
    }

    this.executeService({

      callback: async () => {

        const actualizar =
          this.empresaActual.idEmpresa;

        await this.empresaService.crearToActualizar(
          this.empresaActual
        );

        this.showSuccessAlert(
          actualizar
            ? 'La empresa se actualizó correctamente.'
            : 'La empresa se creó correctamente.'
        );

        this.limpiarFormulario();

        await this.cargarLista();
      },

      showLoading: true

    });
  }

  async eliminar(id?: number) {

    if (!id) {
      return;
    }

    this.showDeleteConfirm(

      async () => {

        this.executeService({

          callback: async () => {

            await this.empresaService.eliminar(id);

            if (
              this.empresaActual.idEmpresa === id
            ) {
              this.limpiarFormulario();
            }

            this.showSuccessAlert(
              'La empresa ha sido eliminada correctamente.'
            );

            await this.cargarLista();
          },

          showLoading: true

        });

      },

      'esta empresa'

    );
  }

  seleccionarParaEditar(empresa: Empresa) {

    this.empresaActual = {
      ...empresa
    };

    if (this.empresaActual.idEmpresa) {

      this.findToItemField(
        this.configuracionCampos,
        'idEmpresa'
      ).hidden = false;

    }
  }

  limpiarFormulario() {

    this.empresaActual = {
      nombre: '',
      direccion: '',
      nit: ''
    };

    this.findToItemField(
      this.configuracionCampos,
      'idEmpresa'
    ).hidden = true;
  }
}