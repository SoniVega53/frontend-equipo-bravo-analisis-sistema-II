import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeneroService } from '../../../core/services/genero.service';
import { Genero } from '../../../interface/genero.interface';
import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { RoleOpciones } from '../../../interface/rolo-opciones.interface';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CollapsedCardComponent } from "../../../shared/collapsed-card/collapsed-card.component";

@Component({
  selector: 'app-genero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
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

  async ngOnInit() {
    await this.cargarPermisos();
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

        this.showSuccessAlert(
          "Se Guardo Correctamente"
        )
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
