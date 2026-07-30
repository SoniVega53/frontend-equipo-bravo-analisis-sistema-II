import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneroService } from '../../core/services/genero.service';
import { Genero } from '../../interface/genero.interface';
import { CustomInputComponent } from '../../shared/custom-input/custom-input.component';
import { LoaderComponent } from '../../shared/loader/loader.component';
import {
  DynamicTableComponent,
  TableColumn,
} from '../../shared/dynamic-table/dynamic-table.component';
import { ApiErrorResponse } from '../../interface/api-error-response';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../interface/dynamic-field.interface';

@Component({
  selector: 'app-genero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomInputComponent,
    LoaderComponent,
    DynamicTableComponent,
    DynamicFormComponent,
  ],
  templateUrl: './genero.component.html',
  styleUrl: './genero.component.css',
})
export class GeneroComponent extends BaseComponent implements OnInit {
  private generoService = inject(GeneroService);

  generos: Genero[] = [];
  generoActual: Genero = { nombre: '' };

  columnasGeneros: TableColumn[] = [];

  configuracionCampos: DynamicField[] = [
    {
      name: 'nombre',
      label: 'Nombre del Género',
      type: 'text',
      placeholder: 'Ej: Masculino',
      required: true,
      colSpan: 6,
    },
  ];


  //ejemplo 

  // configuracionCampos: DynamicField[] = [
  //   {
  //     name: 'nombre',
  //     label: 'Nombre del Género',
  //     type: 'text',
  //     placeholder: 'Ej: Masculino',
  //     required: true,
  //     colSpan: 8,
  //   },
  //   {
  //     name: 'estado',
  //     label: 'Estado',
  //     type: 'dropdown',
  //     placeholder: 'Seleccione estado...',
  //     colSpan: 4,
  //     options: [
  //       { codigo: 'ACT', valor: 'Activo' },
  //       { codigo: 'INA', valor: 'Inactivo' },
  //     ],
  //   },
  //   {
  //     name: 'roles',
  //     label: 'Permisos Asociados',
  //     type: 'multiselect',
  //     placeholder: 'Seleccione permisos...',
  //     iconLeft: 'bi-shield-lock',
  //     colSpan: 12,
  //     options: [
  //       { codigo: 1, valor: 'Lectura' },
  //       { codigo: 2, valor: 'Escritura' },
  //       { codigo: 3, valor: 'Borrado' },
  //     ],
  //   },
  // ];

  async ngOnInit() {
    await this.cargarLista();
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: any = await this.generoService.getGenero();
        this.generos = Array.isArray(data) ? data : [];
        this.columnasGeneros = [
          { field: 'idGenero', header: 'ID' },
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
    console.log(data);
    if (!this.generoActual.nombre) return;

    this.executeService({
      callback: async () => {
        await this.generoService.crearToActualizar(this.generoActual);
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
          await this.generoService.eliminar(id);

          if (this.generoActual.idGenero === id) {
            this.limpiarFormulario();
          }

          this.showSuccessAlert('El género ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este género');
  }

  seleccionarParaEditar(genero: Genero) {
    this.generoActual = { ...genero };
  }

  limpiarFormulario() {
    this.generoActual = { nombre: '' };
  }
}
