import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from '../../base.component';
import { FlujoStatusEmpleadoService } from '../../../core/services/flujo-status-empleado.service';
import {
  FlujoStatusEmpleado,
  FlujoStatusEmpleadoSaveRequest,
} from '../../../interface/flujo-status-empleado.interface';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { SelectOption } from '../../../interface/select-option.interface';

import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';

@Component({
  selector: 'app-flujo-status-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './flujo-status-empleado.component.html',
  styleUrl: './flujo-status-empleado.component.css',
})
export class FlujoStatusEmpleadoComponent extends BaseComponent implements OnInit {
  private flujoService = inject(FlujoStatusEmpleadoService);

  flujos: FlujoStatusEmpleado[] = [];
  flujoActual: FlujoStatusEmpleado = {};
  isUpdate: boolean = false;

  // Catálogos
  optionsStatus: SelectOption[] = [];

  columnasFlujo: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarCatalogosPrincipales();
      await this.cargarLista();
    });
  }

  async cargarCatalogosPrincipales() {
    this.executeService({
      callback: async () => {
        const status: SelectOption[] = await this.catalogoService.getStatusEmpleados();
        this.optionsStatus = this.ordenarGenerico(status, '', 'codigo', 'valor');
        this.configurarCampos();
      },
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      {
        name: 'idStatusActual',
        label: 'Estatus Actual',
        type: 'dropdown',
        required: true,
        options: this.optionsStatus,
        placeholder: 'Seleccione estatus actual',
        colSpan: 6,
      },
      {
        name: 'idStatusNuevo',
        label: 'Estatus Nuevo / Destino',
        type: 'dropdown',
        required: true,
        options: this.optionsStatus,
        placeholder: 'Seleccione nuevo estatus',
        colSpan: 6,
      },
      {
        name: 'nombreEvento',
        label: 'Nombre del Evento',
        type: 'text',
        required: true,
        placeholder: 'Ej: Suspensión médica por IGSS',
        colSpan: 12,
      },
    ];
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: FlujoStatusEmpleado[] = await this.flujoService.getFlujosDetallado();
        const lista = Array.isArray(data) ? data : [];

        this.flujos = lista.map((f) => ({
          ...f,
          nombreStatusActual:
            f.nombreStatusActual ||
            this.optionsStatus.find((s) => s.codigo == f.idStatusActual)?.valor ||
            `Estatus #${f.idStatusActual}`,
          nombreStatusNuevo:
            f.nombreStatusNuevo ||
            this.optionsStatus.find((s) => s.codigo == f.idStatusNuevo)?.valor ||
            `Estatus #${f.idStatusNuevo}`,
        }));

        this.flujos = this.ordenarGenerico(this.flujos, '', 'idStatusActual', 'nombreEvento');

        this.columnasFlujo = [
          { field: 'nombreStatusActual', header: 'Estatus Actual' },
          { field: 'nombreStatusNuevo', header: 'Estatus Destino' },
          { field: 'nombreEvento', header: 'Nombre del Evento' },
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
    if (!this.flujoActual.idStatusActual || !this.flujoActual.idStatusNuevo) {
      this.showErrorAlert('Debe seleccionar el estatus actual y el estatus nuevo.');
      return;
    }

    if (Number(this.flujoActual.idStatusActual) === Number(this.flujoActual.idStatusNuevo)) {
      this.showErrorAlert('El estatus actual y el nuevo no pueden ser idénticos.');
      return;
    }

    if (!this.flujoActual.nombreEvento?.trim()) {
      this.showErrorAlert('Falta ingresar el nombre del evento.');
      return;
    }

    this.executeService({
      callback: async () => {
        const payload: FlujoStatusEmpleadoSaveRequest = {
          idStatusActual: Number(this.flujoActual.idStatusActual),
          idStatusNuevo: Number(this.flujoActual.idStatusNuevo),
          nombreEvento: this.flujoActual.nombreEvento!.trim(),
        };

        if (this.isUpdate) {
          await this.flujoService.actualizar(
            payload.idStatusActual,
            payload.idStatusNuevo,
            payload
          );
          this.showSuccessAlert('Flujo de estatus de empleado actualizado correctamente.');
        } else {
          await this.flujoService.crear(payload);
          this.showSuccessAlert('Flujo de estatus de empleado creado correctamente.');
        }

        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (
      !this.isUpdate ||
      !this.flujoActual.idStatusActual ||
      !this.flujoActual.idStatusNuevo
    ) {
      return;
    }

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.flujoService.eliminar(
            Number(this.flujoActual.idStatusActual),
            Number(this.flujoActual.idStatusNuevo)
          );
          this.limpiarFormulario();
          this.showSuccessAlert(
            'El flujo de estatus de empleado ha sido eliminado correctamente.'
          );
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este flujo de estatus');
  }

  seleccionarParaEditar(flujo: FlujoStatusEmpleado) {
    this.isUpdate = true;
    this.flujoActual = { ...flujo };

    const statusActualField = this.findToItemField(
      this.configuracionCampos,
      'idStatusActual'
    );
    if (statusActualField) {
      statusActualField.disabled = true;
    }

    const statusNuevoField = this.findToItemField(
      this.configuracionCampos,
      'idStatusNuevo'
    );
    if (statusNuevoField) {
      statusNuevoField.disabled = true;
    }
  }

  limpiarFormulario() {
    this.flujoActual = {};
    this.isUpdate = false;

    const statusActualField = this.findToItemField(
      this.configuracionCampos,
      'idStatusActual'
    );
    if (statusActualField) {
      statusActualField.disabled = false;
    }

    const statusNuevoField = this.findToItemField(
      this.configuracionCampos,
      'idStatusNuevo'
    );
    if (statusNuevoField) {
      statusNuevoField.disabled = false;
    }
  }
}

