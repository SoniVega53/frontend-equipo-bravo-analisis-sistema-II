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
import { SucursalService } from '../../../core/services/sucursal.service';
import { ISucursal } from '../../../interface/sucursal.interface';

@Component({
  selector: 'app-sucursal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ],
  templateUrl: './sucursal.component.html',
  styleUrl: './sucursal.component.css',
})
export class SucursalComponent extends BaseComponent implements OnInit {
  private sucursalService = inject(SucursalService);

  sucursales: ISucursal[] = [];
  sucursalActual: ISucursal = {};
  isUpdate: boolean = false;

  optionsEmpresa: SelectOption[] = [];
  columnasSucursales: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.cargarPermisos();
    await this.cargarCatalogosPrincipales();
    await this.cargarLista();
  }

  async cargarCatalogosPrincipales() {
    this.executeService({
      callback: async () => {
        const empresas: SelectOption[] = await this.catalogoService.getEmpresas();
        this.optionsEmpresa = empresas;
        this.configurarCampos();
      }
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'idEmpresa', label: 'Empresa', type: 'dropdown', required: true, colSpan: 6, options: this.optionsEmpresa },
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, colSpan: 6 },
      { name: 'direccion', label: 'Dirección', type: 'text', required: true, colSpan: 12 },
    ];
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.sucursalService.getSucursales();
        this.sucursales = Array.isArray(data) ? data : [];
        this.columnasSucursales = [
          { field: 'idSucursal', header: 'ID' },
          { field: 'idEmpresa', header: 'ID Empresa' },
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
        if (!this.sucursalActual) return;
        
        await this.sucursalService.crearToActualizar(this.sucursalActual);
        
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente");
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.sucursalActual?.idSucursal) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.sucursalService.eliminar(this.sucursalActual.idSucursal );
          this.limpiarFormulario();
          this.showSuccessAlert('La sucursal ha sido eliminada correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'esta sucursal');
  }

  seleccionarParaEditar(sucursal: any) {
    this.isUpdate = true;
    this.sucursalActual = { ...sucursal };
  }

  limpiarFormulario() {
    this.sucursalActual = {};
    this.isUpdate = false;
  }
}