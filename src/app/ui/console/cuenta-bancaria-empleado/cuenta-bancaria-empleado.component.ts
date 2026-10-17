import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from '../../base.component';

import { CuentaBancariaEmpleadoService } from '../../../core/services/cuenta-bancaria-empleado.service';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { BancoService } from '../../../core/services/banco.service';

import { CuentaBancariaEmpleado } from '../../../interface/cuenta-bancaria-empleado.interface';
import { Empleado } from '../../../interface/empleado.interface';
import { Banco } from '../../../interface/banco.interface';
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
export class CuentaBancariaEmpleadoComponent
  extends BaseComponent
  implements OnInit {

  private cuentaService = inject(CuentaBancariaEmpleadoService);
  private empleadoService = inject(EmpleadoService);
  private bancoService = inject(BancoService);

  cuentas: CuentaBancariaEmpleado[] = [];
  empleados: Empleado[] = [];
  bancos: Banco[] = [];

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
          this.empleadoService.getEmpleados(),
          this.bancoService.getBancos(),
        ]);

        console.log('3. Cuentas recibidas:', cuentas);
        console.log('4. Empleados recibidos:', empleados);
        console.log('5. Bancos recibidos:', bancos);

        this.cuentas = Array.isArray(cuentas) ? cuentas : [];
        this.empleados = Array.isArray(empleados) ? empleados : [];
        this.bancos = Array.isArray(bancos) ? bancos : [];

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
    const opcionesEmpleados: SelectOption[] = this.empleados.map(
      (empleado) => ({
        codigo: empleado.idEmpleado,
        valor: empleado.nombreCompleto,
      })
    );

    const opcionesBancos: SelectOption[] = this.bancos.map(
      (banco) => ({
        codigo: banco.idBanco,
        valor: banco.nombre,
      })
    );

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
        options: opcionesEmpleados,
        colSpan: 7,
      },
      {
        name: 'idBanco',
        label: 'Banco',
        type: 'dropdown',
        placeholder: 'Seleccione un banco',
        required: true,
        options: opcionesBancos,
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
          (empleado) => empleado.idEmpleado === cuenta.idEmpleado
        )?.nombreCompleto ?? `Empleado #${cuenta.idEmpleado}`,
      nombreBanco:
        this.bancos.find(
          (banco) => banco.idBanco === cuenta.idBanco
        )?.nombre ?? `Banco #${cuenta.idBanco}`,
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
