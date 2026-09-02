import { Component, EventEmitter, inject, OnInit } from '@angular/core';
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
import { OpcionService } from '../../../core/services/opcion.service';
import { IOpcion } from '../../../interface/opcion.interface';
import { ConsoleComponent } from '../console.component';

@Component({
  selector: 'app-opcion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ], 
  templateUrl: './opcion.component.html',
  styleUrl: './opcion.component.css',
})
export class OpcionComponent extends BaseComponent implements OnInit { 
  private opcionService = inject(OpcionService); 
  private consolePadre = inject(ConsoleComponent);

  opciones: IOpcion[] = [];
  opcionActual: IOpcion = {};
  isUpdate: boolean = false;

  optionsMenu: SelectOption[] = [];
  optionsModulo: SelectOption[] = [];
  columnasOpciones: TableColumn[] = [];
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
        const modulo: SelectOption[] = await this.catalogoService.getModulos();
        this.optionsModulo = modulo;
        this.configurarCampos();
      }
    });
  }


  async cargarCatalogosMenuIdModulo(id:number) {
    if (!id) return;

    this.executeService({
      callback: async () => {
        const menus: SelectOption[] = await this.catalogoService.getMenusIdModule(id);
        this.optionsMenu = menus;
        this.findToItemField(this.configuracionCampos, "idMenu").options = this.optionsMenu;
      }
    });
  }

  configurarCampos() {
    const empresaChangeEvent = new EventEmitter<any>();

    empresaChangeEvent.subscribe((id: any) => {
      console.log('seleccionada:', id);
      this.cargarCatalogosMenuIdModulo(id);
    });

    this.configuracionCampos = [
      { name: 'idModulo', label: 'Modulo', type: 'dropdown', required: true, colSpan: 6, options: this.optionsModulo,
        onChange: empresaChangeEvent
      },
      { name: 'idMenu', label: 'Menú', type: 'dropdown', required: true, colSpan: 6, options:[] },
      { name: 'nombre', label: 'Nombre de Opción', type: 'text', required: true, colSpan: 6 },
      { name: 'pagina', label: 'Ruta/Página', type: 'text', required: true, colSpan: 6 },
      { name: 'ordenMenu', label: 'Orden', type: 'number', required: true, colSpan: 6 }
    ];
  }

  async cargarLista() {
    this.executeService({ 
      callback: async () => {
        const data = await this.opcionService.getOpciones();
        this.opciones = Array.isArray(data) ? data : [];
        this.columnasOpciones = [
          { field: 'idOpcion', header: 'ID' },
          { field: 'idMenu', header: 'ID Menú' },
          { field: 'nombre', header: 'Nombre' },
          { field: 'pagina', header: 'Ruta' },
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
        if (!this.opcionActual) return;
        
        await this.opcionService.crearToActualizar(this.opcionActual);
        
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente"); 
        this.limpiarFormulario();
        await this.cargarLista();
        this.consolePadre?.updateListaMenu();
      },
      showLoading: true, 
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.opcionActual?.idOpcion) return; 

    this.showDeleteConfirm(async () => { 
      this.executeService({
        callback: async () => {
          await this.opcionService.eliminar(this.opcionActual.idOpcion);
          this.limpiarFormulario();
          this.showSuccessAlert('La opción ha sido eliminada correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'esta opción');
  }

  seleccionarParaEditar(opcion: any) {
    this.isUpdate = true; 
    this.opcionActual = { ...opcion };

    if (this.opcionActual.idModulo) {
      this.cargarCatalogosMenuIdModulo(this.opcionActual.idModulo);
    }

  }

  limpiarFormulario() {
    this.opcionActual = {}; 
    this.isUpdate = false;
  }
}