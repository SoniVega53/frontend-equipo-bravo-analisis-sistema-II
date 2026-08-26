import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CollapsedCardComponent } from "../../../shared/collapsed-card/collapsed-card.component";
import { EmpresaService } from '../../../core/services/empresa.service';
import { IEmpresa } from '../../../interface/empresa.interface';

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

  empresas: IEmpresa[] = [];
  empresaActual: IEmpresa = {};
  isUpdate: boolean = false;

  columnasEmpresas: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.cargarPermisos(); 
    this.configurarCampos();
    await this.cargarLista(); 
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, colSpan: 4 }, 
      { name: 'direccion', label: 'Dirección', type: 'text', required: true, colSpan: 4 },
      { name: 'nit', label: 'NIT', type: 'number', required: true, colSpan: 4 },
      { name: 'passwordLargo', label: 'Largo Mínimo Contraseña', type: 'number', required: false, colSpan: 3 },
      { name: 'passwordCantidadMayusculas', label: 'Min. Mayúsculas', type: 'number', required: false, colSpan: 3 },
      { name: 'passwordCantidadMinusculas', label: 'Min. Minúsculas', type: 'number', required: false, colSpan: 3 },
      { name: 'passwordCantidadNumeros', label: 'Min. Números', type: 'number', required: false, colSpan: 3 },
      { name: 'passwordCantidadCaracteresEspeciales', label: 'Min. Caracteres Esp.', type: 'number', required: false, colSpan: 4 },
      { name: 'passwordCantidadCaducidadDias', label: 'Días Caducidad', type: 'number', required: false, colSpan: 4 },
      { name: 'passwordIntentosAntesDeBloquear', label: 'Intentos Antes Bloqueo', type: 'number', required: false, colSpan: 4 },
    ];
  }

  async cargarLista() {
    this.executeService({ 
      callback: async () => {
        const data = await this.empresaService.getEmpresas();
        this.empresas = Array.isArray(data) ? data : [];
        this.columnasEmpresas = [
          { field: 'idEmpresa', header: 'ID' },
          { field: 'nombre', header: 'Nombre' },
          { field: 'nit', header: 'NIT' },
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
        if (!this.empresaActual) return;
        
        await this.empresaService.crearToActualizar(this.empresaActual);
        
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente"); 
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true, 
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.empresaActual?.idEmpresa) return; 

    this.showDeleteConfirm(async () => { 
      this.executeService({
        callback: async () => {
          await this.empresaService.eliminar(this.empresaActual.idEmpresa);
          this.limpiarFormulario();
          this.showSuccessAlert('La empresa ha sido eliminada correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'esta empresa');
  }

  seleccionarParaEditar(empresa: any) {
    this.isUpdate = true; 
    this.empresaActual = { ...empresa };
  }

  limpiarFormulario() {
    this.empresaActual = {}; 
    this.isUpdate = false;
  }
}