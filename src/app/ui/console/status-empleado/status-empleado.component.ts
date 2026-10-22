
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BaseComponent } from '../../base.component';
import { StatusEmpleadoService } from '../../../core/services/status-empleado.service';
import { StatusEmpleado } from '../../../interface/status-empleado.interface';

import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';

import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';

import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';

@Component({
  selector: 'app-status-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './status-empleado.component.html',
  styleUrl: './status-empleado.component.css',
})
export class StatusEmpleadoComponent extends BaseComponent implements OnInit {
  private statusEmpleadoService = inject(StatusEmpleadoService);

  statusEmpleados: StatusEmpleado[] = [];

  statusEmpleadoActual: StatusEmpleado = {
    nombre: '',
  };

  columnasStatusEmpleado: TableColumn[] = [];

  configuracionCampos: DynamicField[] = [
    {
      name: 'idStatusEmpleado',
      label: 'ID Estatus Empleado',
      type: 'text',
      placeholder: 'idStatusEmpleado',
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
    await this.onChangeViewURL(async () => {
      await this.cargarLista();
    });
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: any =
          await this.statusEmpleadoService.getStatusEmpleado();

        this.statusEmpleados = Array.isArray(data) ? data : [];

        this.columnasStatusEmpleado = [
          {
            field: 'idStatusEmpleado',
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
    if (!this.statusEmpleadoActual.nombre?.trim()) return;

    this.executeService({
      callback: async () => {
        const actualizar =
          !!this.statusEmpleadoActual.idStatusEmpleado;

        await this.statusEmpleadoService.crearToActualizar(
          this.statusEmpleadoActual
        );

        this.showSuccessAlert(
          actualizar
            ? 'Se actualizó correctamente'
            : 'Se guardó correctamente'
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
          await this.statusEmpleadoService.eliminar(id);

          if (
            this.statusEmpleadoActual.idStatusEmpleado === id
          ) {
            this.limpiarFormulario();
          }

          this.showSuccessAlert(
            'El estatus de empleado ha sido eliminado correctamente.'
          );

          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este estatus de empleado');
  }

  seleccionarParaEditar(statusEmpleado: StatusEmpleado) {
    this.statusEmpleadoActual = { ...statusEmpleado };

    if (this.statusEmpleadoActual.idStatusEmpleado) {
      this.findToItemField(
        this.configuracionCampos,
        'idStatusEmpleado'
      ).hidden = false;
    }
  }

  limpiarFormulario() {
    this.statusEmpleadoActual = {
      nombre: '',
    };

    this.findToItemField(
      this.configuracionCampos,
      'idStatusEmpleado'
    ).hidden = true;
  }
}
