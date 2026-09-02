import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CollapsedCardComponent } from "../../../shared/collapsed-card/collapsed-card.component";
import { ModuloService } from '../../../core/services/modulo.service';
import { IModulo } from '../../../interface/modulo.interface';

@Component({
  selector: 'app-modulo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ], 
  templateUrl: './modulo.component.html',
  styleUrl: './modulo.component.css',
})
export class ModuloComponent extends BaseComponent implements OnInit { 
  private moduloService = inject(ModuloService); 

  modulos: IModulo[] = [];
  moduloActual: IModulo = {};
  isUpdate: boolean = false;

  columnasModulos: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      this.configurarCampos();
      await this.cargarLista();   
    }); 

  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'nombre', label: 'Nombre del Módulo', type: 'text', required: true, colSpan: 6 },
      { name: 'ordenMenu', label: 'Orden', type: 'number', required: true, colSpan: 6 }
    ];
  }

  async cargarLista() {
    this.executeService({ 
      callback: async () => {
        const data = await this.moduloService.getModulos();
        this.modulos = Array.isArray(data) ? data : [];
        this.columnasModulos = [
          { field: 'idModulo', header: 'ID' },
          { field: 'nombre', header: 'Nombre' },
          { field: 'ordenMenu', header: 'Orden' },
          { 
            field: 'fechaCreacion',
            header: 'Creación',
            type: 'audit',
            userField: 'usuarioCreacion',
            dateField: 'fechaCreacion',
          },
          { 
            field: 'fechaModificacion',
            header: 'Modificación',
            type: 'audit',
            userField: 'usuarioModificacion',
            dateField: 'fechaModificacion',
          },
        ];
      }
    });
  }

  async guardar() {
    this.executeService({ 
      callback: async () => {
        if (!this.moduloActual) return;
        
        await this.moduloService.crearToActualizar(this.moduloActual);
        
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente"); 
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true, 
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.moduloActual?.idModulo) return; 

    this.showDeleteConfirm(async () => { 
      this.executeService({
        callback: async () => {
          await this.moduloService.eliminar(this.moduloActual.idModulo);
          this.limpiarFormulario();
          this.showSuccessAlert('El módulo ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este módulo');
  }

  seleccionarParaEditar(modulo: any) {
    this.isUpdate = true; 
    this.moduloActual = { ...modulo };
  }

  limpiarFormulario() {
    this.moduloActual = {}; 
    this.isUpdate = false;
  }
}