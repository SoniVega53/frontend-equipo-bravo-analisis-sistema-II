import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StatusUsuarioService } from '../../../core/services/status-usuario.service';
import { StatusUsuario } from '../../../interface/status-usuario.interface';

import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';

import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';

import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';

@Component({
  selector: 'app-status-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './status-usuario.component.html',
  styleUrl: './status-usuario.component.css',
})
export class StatusUsuarioComponent extends BaseComponent implements OnInit {

  private statusUsuarioService = inject(StatusUsuarioService);

  statusUsuarios: StatusUsuario[] = [];

  statusUsuarioActual: StatusUsuario = {
    nombre: '',
  };

  columnasStatusUsuario: TableColumn[] = [];

  configuracionCampos: DynamicField[] = [
    {
      name: 'idStatusUsuario',
      label: 'ID Estatus Usuario',
      type: 'text',
      placeholder: 'idStatusUsuario',
      disabled: true,
      colSpan: 7,
      hidden: true,
    },
    {
      name: 'nombre',
      label: 'Nombre del Estatus',
      type: 'text',
      placeholder: 'Ej: Activo',
      required: true,
      colSpan: 7,
    },
  ];

  async ngOnInit() {
    await this.cargarPermisos();
    await this.cargarLista();
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: any =
          await this.statusUsuarioService.getStatusUsuario();

        this.statusUsuarios = Array.isArray(data) ? data : [];

        this.columnasStatusUsuario = [
          {
            field: 'idStatusUsuario',
            header: 'ID',
          },
          {
            field: 'nombre',
            header: 'Nombre',
          },
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
    if (!this.statusUsuarioActual.nombre) return;

    this.executeService({
      callback: async () => {
        await this.statusUsuarioService.crearToActualizar(
          this.statusUsuarioActual
        );

        const update =
          this.statusUsuarioActual.idStatusUsuario;

        this.showSuccessAlert(
          update
            ? 'Se Actualizó Correctamente'
            : 'Se Guardó Correctamente'
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
          await this.statusUsuarioService.eliminar(id);

          if (
            this.statusUsuarioActual.idStatusUsuario === id
          ) {
            this.limpiarFormulario();
          }

          this.showSuccessAlert(
            'El estatus de usuario ha sido eliminado correctamente.'
          );

          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este estatus de usuario');
  }

  seleccionarParaEditar(statusUsuario: StatusUsuario) {
    this.statusUsuarioActual = {
      ...statusUsuario,
    };

    if (this.statusUsuarioActual.idStatusUsuario) {
      this.findToItemField(
        this.configuracionCampos,
        'idStatusUsuario'
      ).hidden = false;
    }
  }

  limpiarFormulario() {
    this.statusUsuarioActual = {
      nombre: '',
    };

    this.findToItemField(
      this.configuracionCampos,
      'idStatusUsuario'
    ).hidden = true;
  }
}