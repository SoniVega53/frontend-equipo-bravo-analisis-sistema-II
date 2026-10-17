import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from '../../base.component';

import { CuentaBancariaEmpleadoService } from '../../../core/services/cuenta-bancaria-empleado.service';

import { CuentaBancariaEmpleado } from '../../../interface/cuenta-bancaria-empleado.interface';
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
  selector: 'app-cuenta-bancaria-empleado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './cuenta-bancaria-empleado.component.html',
  styleUrl: './cuenta-bancaria-empleado.component.css',
})
export class CuentaBancariaEmpleadoComponent extends BaseComponent implements OnInit {

  private cuentaService = inject(CuentaBancariaEmpleadoService);

  cuentas: CuentaBancariaEmpleado[] = [];
  empleados: SelectOption[] = [];
  bancos: SelectOption[] = [];

  cuentaActual: CuentaBancariaEmpleado = this.nuevaCuenta();

  columnas: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  private nuevaCuenta(): CuentaBancariaEmpleado {
    return {
      idEmpleado: 0,
      idBanco: 0,
      numeroDeCuenta: '',
      activa: 'S',
    };
  }

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarDatos();
    });
  }

  
async cargarDatos() {
  console.log('1. Entró a cargarDatos()');

  this.executeService({
    callback: async () => {
      try {
        console.log('2. Iniciando carga de información');

        const [cuentas, empleados, bancos] = await Promise.all([
          this.cuentaService.getCuentasBancariasEmpleado(),
          this.catalogoService.getEmpleados(false),
          this.catalogoService.getBancos(),
        ]);

        this.cuentas = this.ordenarGenerico(Array.isArray(cuentas) ? cuentas : [], '', 'idCuentaBancaria', 'numeroDeCuenta');
        this.cuentas = this.cuentas.map((cuenta) => ({
          ...cuenta,
          activa: cuenta.activa === 'S' || cuenta.activa === '1' ? 'S' : 'N',
        }));

        this.empleados = this.ordenarGenerico(empleados, '', 'codigo', 'valor');
        this.bancos = this.ordenarGenerico(bancos, '', 'codigo', 'valor');

        this.configurarCampos();
        this.configurarColumnas();

        console.log(
          '6. Campos configurados:',
          this.configuracionCampos
        );
      } catch (error) {
        console.error('Error al cargar cuentas bancarias:', error);
      }
    },
  });
}


  private configurarCampos() {
    this.configuracionCampos = [
      {
        name: 'idCuentaBancaria',
        label: 'ID Cuenta Bancaria',
        type: 'text',
        disabled: true,
        hidden: true,
        colSpan: 7,
      },
      {
        name: 'idEmpleado',
        label: 'Empleado',
        type: 'dropdown',
        placeholder: 'Seleccione un empleado',
        required: true,
        options: this.empleados,
        colSpan: 7,
      },
      {
        name: 'idBanco',
        label: 'Banco',
        type: 'dropdown',
        placeholder: 'Seleccione un banco',
        required: true,
        options: this.bancos,
        colSpan: 7,
      },
      {
        name: 'numeroDeCuenta',
        label: 'Número de cuenta',
        type: 'text',
        placeholder: 'Ingrese el número de cuenta',
        required: true,
        colSpan: 7,
      },
      {
        name: 'activa',
        label: 'Cuenta activa',
        type: 'dropdown',
        required: true,
        options: [
          { codigo: 'S', valor: 'Sí' },
          { codigo: 'N', valor: 'No' },
        ],
        colSpan: 7,
      },
    ];
  }

  private configurarColumnas() {
    this.columnas = [
      {
        field: 'idCuentaBancaria',
        header: 'ID',
      },
      {
        field: 'nombreEmpleado',
        header: 'Empleado',
      },
      {
        field: 'nombreBanco',
        header: 'Banco',
      },
      {
        field: 'numeroDeCuenta',
        header: 'Número de cuenta',
      },
      {
        field: 'activa',
        header: 'Activa',
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

    this.cuentas = this.cuentas.map((cuenta) => ({
      ...cuenta,
      nombreEmpleado:
        this.empleados.find(
          (empleado) => empleado.codigo === cuenta.idEmpleado
        )?.valor ?? `Empleado #${cuenta.idEmpleado}`,
      nombreBanco:
        this.bancos.find(
          (banco) => banco.codigo === cuenta.idBanco
        )?.valor ?? `Banco #${cuenta.idBanco}`,
    }));
  }

  async guardar() {
    if (
      !this.cuentaActual.idEmpleado ||
      !this.cuentaActual.idBanco ||
      !this.cuentaActual.numeroDeCuenta?.trim() ||
      !this.cuentaActual.activa
    ) {
      return;
    }

    this.executeService({
      callback: async () => {
        const actualizar = !!this.cuentaActual.idCuentaBancaria;

        this.cuentaActual.activa = this.cuentaActual.activa === 'S' || this.cuentaActual.activa === '1' ? '1' : '0';

        await this.cuentaService.crearToActualizar({
          ...this.cuentaActual,
          numeroDeCuenta: this.cuentaActual.numeroDeCuenta.trim(),
        });

        this.showSuccessAlert(
          actualizar
            ? 'La cuenta bancaria se actualizó correctamente.'
            : 'La cuenta bancaria se creó correctamente.'
        );

        this.limpiarFormulario();
        await this.cargarDatos();
      },
      showLoading: true,
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
            await this.cuentaService.eliminar(id);

            if (this.cuentaActual.idCuentaBancaria === id) {
              this.limpiarFormulario();
            }

            this.showSuccessAlert(
              'La cuenta bancaria se eliminó correctamente.'
            );

            await this.cargarDatos();
          },
          showLoading: true,
        });
      },
      'esta cuenta bancaria'
    );
  }

  seleccionarParaEditar(cuenta: CuentaBancariaEmpleado) {
    this.cuentaActual = {
      ...cuenta,
      activa: cuenta.activa,
    };

    this.findToItemField(
      this.configuracionCampos,
      'idCuentaBancaria'
    ).hidden = false;
  }

  limpiarFormulario() {
    this.cuentaActual = this.nuevaCuenta();

    const campoId = this.configuracionCampos.find(
      (campo) => campo.name === 'idCuentaBancaria'
    );

    if (campoId) {
      campoId.hidden = true;
    }
  }
}
