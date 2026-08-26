import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CollapsedCardComponent } from "../../../shared/collapsed-card/collapsed-card.component";
import { SelectOption } from '../../../interface/select-option.interface';
import { CatalogoService } from '../../../core/services/CatalogoService';
import { MenuService } from '../../../core/services/menu.service';
import { IMenu } from '../../../interface/menu.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ], 
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent extends BaseComponent implements OnInit { 
  private menuService = inject(MenuService); 

  menus: IMenu[] = [];
  menuActual: IMenu = {};
  isUpdate: boolean = false;

  optionsModulo: SelectOption[] = [];
  columnasMenus: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.cargarPermisos(); 
    await this.cargarCatalogosPrincipales();
    await this.cargarLista(); 
  }

  async cargarCatalogosPrincipales() {
    this.executeService({
      callback: async () => {
        const modulos: SelectOption[] = await this.catalogoService.getModulos();
        this.optionsModulo = modulos;
        this.configurarCampos();
      }
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'idModulo', label: 'Módulo', type: 'dropdown', required: true, colSpan: 4, options: this.optionsModulo },
      { name: 'nombre', label: 'Nombre del Menú', type: 'text', required: true, colSpan: 4 },
      { name: 'ordenMenu', label: 'Orden', type: 'number', required: true, colSpan: 4 }
    ];
  }

  async cargarLista() {
    this.executeService({ 
      callback: async () => {
        const data = await this.menuService.getMenus();
        this.menus = Array.isArray(data) ? data : [];
        this.columnasMenus = [
          { field: 'idMenu', header: 'ID' },
          { field: 'idModulo', header: 'ID Módulo' },
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
        if (!this.menuActual) return;
        
        await this.menuService.crearToActualizar(this.menuActual);
        
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente"); 
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true, 
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.menuActual?.idMenu) return; 

    this.showDeleteConfirm(async () => { 
      this.executeService({
        callback: async () => {
          await this.menuService.eliminar(this.menuActual.idMenu);
          this.limpiarFormulario();
          this.showSuccessAlert('El menú ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este menú');
  }

  seleccionarParaEditar(menu: any) {
    this.isUpdate = true; 
    this.menuActual = { ...menu };
  }

  limpiarFormulario() {
    this.menuActual = {}; 
    this.isUpdate = false;
  }
}