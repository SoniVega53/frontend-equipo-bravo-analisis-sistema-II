import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { BaseComponent } from '../../base.component';
import { RoleOpcionService } from '../../../core/services/role-opcion.service';
import { ListadoOpcionesItem, ModuloItem, RoleOpcionTabla, RolItem } from '../../../interface/rolo-opciones.interface';
import { RoleOpcionTableComponent } from "../../../shared/role-opcion-table/role-opcion-table.component";
import { DropdownSelectComponent } from "../../../shared/dropdown-select/dropdown-select.component";
import { SelectOption } from '../../../interface/select-option.interface';

@Component({
  selector: 'asignacion-opcion-role',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoaderComponent,
    RoleOpcionTableComponent,
    DropdownSelectComponent
],
  templateUrl: './asignacion-opcion-role.component.html',
  styleUrl: './asignacion-opcion-role.component.css',
})
export class AsignacionOpcionRoleComponent  extends BaseComponent implements OnInit{
  @ViewChild("tablaRole") tablaRole:RoleOpcionTableComponent | undefined;
  
  permisosTabla: RoleOpcionTabla[] = [];
  permisosTablaOriginal: RoleOpcionTabla[] = [];
  updateTabla: RoleOpcionTabla[] = [];

  opcionesRol:SelectOption[] = [];
  modelRol:any = "";

  opcionesModulo:SelectOption[] = [];
  modelModulo:any = "";

  async ngOnInit() {
    await this.cargarPermisos();
    await this.cargarListaModulo();
  }

  async cargarListaTabla() {
    this.executeService({
      callback: async () => {
        const data: any = await this.roleOpService.getTable(Number(this.modelRol),Number(this.modelModulo));
        this.permisosTabla = data;
        this.permisosTablaOriginal = structuredClone(data);
      },
    });
  }

  async cargarListaModulo() {
    this.executeService({
      callback: async () => {
        const data: ListadoOpcionesItem = await this.roleOpService.getOpcionesList();
        this.opcionesModulo = await this.convertirOption(data.modulos,0,{
          codigo: 'idModulo',
          valor: 'nombre',
        });

        this.opcionesRol = await this.convertirOption(data.roles,1,{
          codigo: 'idRole',
          valor: 'nombre',
        });

        this.modelModulo = data?.modulos[0]?.idModulo || "";
        this.modelRol = data?.roles[0]?.idRole || "";

        this.selectionChange();

        console.log("modulo:",  this.modelModulo );
      },
      showLoading:true
    });
  }
  
  async modificarTabla() {
    if (!this.updateTabla) return;
    this.executeService({
      callback: async () => {
        const response = await this.roleOpService.modificarTabla(
          this.updateTabla
        );

        this.permisosTablaOriginal = structuredClone(this.permisosTabla);
        this.tablaRole?.clearDataUpdate();
        this.updateTabla = [];

        this.showSuccessAlert(response);
      },
    });
  }
 

  onClickActions(){
    this.showWarningAlert("Por favor, guarde los cambios antes de realizar esta acción.");
  }

  guardarCambios(): void {
    this.modificarTabla();
  }

  cancelarCambios(): void {
    this.permisosTabla = structuredClone(this.permisosTablaOriginal);
    this.tablaRole?.clearDataUpdate();
    this.updateTabla = [];
  }

  onPermisosActualizados(nuevosPermisos: RoleOpcionTabla[]): void {
    this.updateTabla = nuevosPermisos;
  }

  async selectionChange(){
    if (this.modelModulo && this.modelRol) {
      await this.cargarListaTabla(); 
    }
  }
}
