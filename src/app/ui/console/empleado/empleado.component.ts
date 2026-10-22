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
import { EmpleadoCrudService } from '../../../core/services/empleado-crud.service';
import { IEmpleado } from '../../../interface/empleado.interface';

const ID_STATUS_ACTIVO = 1;

@Component({
  selector: 'app-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './empleado.component.html',
  styleUrl: './empleado.component.css',
})
export class EmpleadoComponent extends BaseComponent implements OnInit {
  private empleadoService = inject(EmpleadoCrudService);

  empleados: any[] = [];
  empleadoActual: IEmpleado = { idStatusEmpleado: ID_STATUS_ACTIVO };
  isUpdate: boolean = false;

  optionsPersona: SelectOption[] = [];
  optionsSucursal: SelectOption[] = [];
  optionsPuesto: SelectOption[] = [];
  optionsStatus: SelectOption[] = [];

  columnas: TableColumn[] = [];
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
        this.optionsPersona = await this.catalogoService.getPersonas();
        this.optionsSucursal = await this.catalogoService.getSucursales();
        this.optionsPuesto = await this.catalogoService.getPuestos();
        this.optionsStatus = await this.catalogoService.getStatusEmpleados();
        this.configurarCampos();
        this.actualizarOpcionesFormulario();
      },
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'idPersona', label: 'Persona', type: 'dropdown', required: true, colSpan: 6, options: this.optionsPersona },
      { name: 'idSucursal', label: 'Sucursal', type: 'dropdown', required: true, colSpan: 6, options: this.optionsSucursal },
      { name: 'idPuesto', label: 'Puesto', type: 'dropdown', required: true, colSpan: 6, options: this.optionsPuesto },
      { name: 'idStatusEmpleado', label: 'Estatus', type: 'dropdown', required: true, colSpan: 6, options: this.optionsStatus },
      { name: 'fechaContratacion', label: 'Fecha de Contratación', type: 'date', required: true, colSpan: 6 },
      { name: 'ingresoSueldoBase', label: 'Sueldo Base (Q)', type: 'number', required: true, colSpan: 6 },
      { name: 'ingresoBonificacionDecreto', label: 'Bonificación Decreto (Q)', type: 'number', required: true, colSpan: 4 },
      { name: 'ingresoOtrosIngresos', label: 'Otros Ingresos (Q)', type: 'number', required: true, colSpan: 4 },
      { name: 'descuentoIgss', label: 'Descuento IGSS (Q)', type: 'number', required: true, colSpan: 4 },
      { name: 'descuentoIsr', label: 'Descuento ISR (Q)', type: 'number', required: true, colSpan: 6 },
      { name: 'descuentoInasistencias', label: 'Descuento Inasistencias (Q)', type: 'number', required: true, colSpan: 6 },
    ];
  }

  /**
   * Personas disponibles: al crear solo las que aún no son empleados;
   * al editar, además la persona del empleado actual.
   */
  private opcionesPersonaDisponibles(): SelectOption[] {
    const ocupadas = new Set(
      this.empleados
        .filter((e) => e.idEmpleado !== this.empleadoActual.idEmpleado)
        .map((e) => e.idPersona),
    );
    return this.optionsPersona.filter((p) => !ocupadas.has(p.codigo));
  }

  /** Estatus: al crear solo Activo; al editar el actual y los destinos permitidos por el flujo. */
  private async actualizarOpcionesFormulario() {
    const campoPersona = this.findToItemField(this.configuracionCampos, 'idPersona');
    const campoStatus = this.findToItemField(this.configuracionCampos, 'idStatusEmpleado');
    if (!campoPersona || !campoStatus) return;

    campoPersona.options = this.opcionesPersonaDisponibles();

    if (this.isUpdate && this.empleadoActual.idEmpleado) {
      const permitidos = await this.empleadoService.getStatusPermitidos(this.empleadoActual.idEmpleado);
      campoStatus.options = permitidos.length ? permitidos : this.optionsStatus;
    } else {
      campoStatus.options = this.optionsStatus.filter((s) => s.codigo == ID_STATUS_ACTIVO);
    }
  }

  private nombreOpcion(options: SelectOption[], codigo: any): string {
    return options.find((o) => o.codigo == codigo)?.valor || '-';
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.empleadoService.getEmpleado();
        this.empleados = (Array.isArray(data) ? data : []).map((e: any) => ({
          ...e,
          persona: this.nombreOpcion(this.optionsPersona, e.idPersona),
          sucursal: this.nombreOpcion(this.optionsSucursal, e.idSucursal),
          puesto: this.nombreOpcion(this.optionsPuesto, e.idPuesto),
          status: this.nombreOpcion(this.optionsStatus, e.idStatusEmpleado),
        }));

        this.empleados = this.ordenarGenerico(this.empleados, '', 'idEmpleado', 'persona');

        this.columnas = [
          { field: 'idEmpleado', header: 'ID' },
          { field: 'persona', header: 'Persona' },
          { field: 'sucursal', header: 'Sucursal' },
          { field: 'puesto', header: 'Puesto' },
          { field: 'status', header: 'Estatus' },
          { field: 'fechaContratacion', header: 'Contratación' },
          { field: 'ingresoSueldoBase', header: 'Sueldo Base' },
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
        await this.actualizarOpcionesFormulario();
      },
    });
  }

  async guardar() {
    this.executeService({
      callback: async () => {
        await this.empleadoService.crearToActualizar(this.empleadoActual);

        this.showSuccessAlert(this.isUpdate ? 'Se Actualizó Correctamente' : 'Se Guardó Correctamente');
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.empleadoActual?.idEmpleado) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.empleadoService.eliminar(this.empleadoActual.idEmpleado!);
          this.limpiarFormulario();
          this.showSuccessAlert('El empleado ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este empleado');
  }

  async seleccionarParaEditar(item: any) {
    this.isUpdate = true;
    // Los montos se pasan como texto para que el campo muestre también los valores en 0
    this.empleadoActual = {
      idEmpleado: item.idEmpleado,
      idPersona: item.idPersona,
      idSucursal: item.idSucursal,
      fechaContratacion: item.fechaContratacion,
      idPuesto: item.idPuesto,
      idStatusEmpleado: item.idStatusEmpleado,
      ingresoSueldoBase: String(item.ingresoSueldoBase ?? ''),
      ingresoBonificacionDecreto: String(item.ingresoBonificacionDecreto ?? ''),
      ingresoOtrosIngresos: String(item.ingresoOtrosIngresos ?? ''),
      descuentoIgss: String(item.descuentoIgss ?? ''),
      descuentoIsr: String(item.descuentoIsr ?? ''),
      descuentoInasistencias: String(item.descuentoInasistencias ?? ''),
    };
    await this.actualizarOpcionesFormulario();
  }

  async limpiarFormulario() {
    this.empleadoActual = { idStatusEmpleado: ID_STATUS_ACTIVO };
    this.isUpdate = false;
    await this.actualizarOpcionesFormulario();
  }
}
