import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CollapsedCardComponent } from "../../../shared/collapsed-card/collapsed-card.component";
import { RoleService } from '../../../core/services/role.service';
import { IRole } from '../../../interface/role.interface';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ], 
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent extends BaseComponent implements OnInit { 
  private roleService = inject(RoleService); 

  roles: IRole[] = [];
  roleActual: IRole = {};
  isUpdate: boolean = false;

  columnasRoles: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.cargarPermisos(); 
    this.configurarCampos();
    await this.cargarLista(); 
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'nombre', label: 'Nombre del Rol', type: 'text', required: true, colSpan: 7 }
    ];
  }

  async cargarLista() {
    this.executeService({ 
      callback: async () => {
        const data = await this.roleService.getRoles();
        this.roles = Array.isArray(data) ? data : [];
        this.columnasRoles = [
          { field: 'idRole', header: 'ID' },
          { field: 'nombre', header: 'Nombre' },
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
        if (!this.roleActual) return;
        
        await this.roleService.crearToActualizar(this.roleActual);
        
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente"); 
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true, 
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.roleActual?.idRole) return; 

    this.showDeleteConfirm(async () => { 
      this.executeService({
        callback: async () => {
          await this.roleService.eliminar(this.roleActual.idRole);
          this.limpiarFormulario();
          this.showSuccessAlert('El rol ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este rol');
  }

  seleccionarParaEditar(role: any) {
    this.isUpdate = true; 
    this.roleActual = { ...role };
  }

  limpiarFormulario() {
    this.roleActual = {}; 
    this.isUpdate = false;
  }
}