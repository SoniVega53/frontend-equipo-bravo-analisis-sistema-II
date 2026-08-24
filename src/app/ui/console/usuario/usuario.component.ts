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
import { UsuarioService } from '../../../core/services/usuarios.service';
import { IUsuario, UsuarioSaveRequest } from '../../../interface/usuario.interface';
import { PasswordPolicy } from '../../../interface/password-policy';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent extends BaseComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: IUsuario[] = [];
  usuarioActual: IUsuario = {};
  politicaActual: any = null;
  isUpdate: boolean = false;


  // Catálogos
  optionsEmpresa: SelectOption[] = [];
  optionsSucursal: SelectOption[] = [];
  optionsGenero: SelectOption[] = [];
  optionsStatus: SelectOption[] = [];
  optionsRole: SelectOption[] = [];

  columnasUsuarios: TableColumn[] = [];

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
        const generos: SelectOption[] = await this.catalogoService.getGeneros();
        const status: SelectOption[] = await this.catalogoService.getStatusUsuario();
        const roles: SelectOption[] = await this.catalogoService.getRoles();

        this.optionsEmpresa = empresas;
        this.optionsGenero = generos;
        this.optionsStatus = status;
        this.optionsRole = roles;

        this.configurarCampos();
      }
    });
  }

  configurarCampos() {
    const empresaChangeEvent = new EventEmitter<any>();

    empresaChangeEvent.subscribe((idEmpresa: any) => {
      console.log('Empresa seleccionada:', idEmpresa);
      this.alCambiarEmpresa(idEmpresa);
    });


    this.configuracionCampos = [
      { name: 'idUsuario', label: 'Usuario', type: 'text', required: true, colSpan: 4 },
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, colSpan: 4 },
      { name: 'apellido', label: 'Apellidos', type: 'text', required: true, colSpan: 4 },
      { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', required: true, colSpan: 4 },
      { name: 'correoElectronico', label: 'Correo Electrónico', type: 'email', required: true, colSpan: 4 },
      { name: 'telefonoMovil', label: 'Teléfono Móvil', type: 'number', required: true, colSpan: 4 },
      {
        name: 'idEmpresa', label: 'Empresa', type: 'dropdown', required: true, colSpan: 6, options: this.optionsEmpresa,
        onChange: empresaChangeEvent
      },
      { name: 'idSucursal', label: 'Sucursal', type: 'dropdown', required: true, colSpan: 6, options: [] },
      { name: 'idGenero', label: 'Género', type: 'dropdown', required: true, colSpan: 4, options: this.optionsGenero },
      { name: 'idStatusUsuario', label: 'Estatus', type: 'dropdown', required: true, colSpan: 4, options: this.optionsStatus },
      { name: 'idRole', label: 'Rol', type: 'dropdown', required: true, colSpan: 4, options: this.optionsRole },

      { name: 'pregunta', label: 'Pregunta Recuperación', type: 'text', required: true, colSpan: 6 },
      { name: 'respuesta', label: 'Respuesta Recuperación', type: 'text', required: true, colSpan: 6 },

      { name: 'password', label: 'Contraseña', type: 'password-policy', required: true, colSpan: 12, policyData: this.politicaActual, hidden: true },

    ];
  }

  async alCambiarEmpresa(idEmpresa: number) {
    if (!idEmpresa) return;

    this.executeService({
      callback: async () => {
        const sucursales: any = await this.catalogoService.getSucursalesEmpresa(idEmpresa);
        this.optionsSucursal = sucursales;

        this.findToItemField(this.configuracionCampos, "idSucursal").options = this.optionsSucursal;

        const response: PasswordPolicy = await this.securityService.getPoliticaPassword(idEmpresa);
        this.politicaActual = response;

        const findPasswordField = this.findToItemField(this.configuracionCampos, "password");
        if (findPasswordField && !this.isUpdate) {
          findPasswordField.hidden = false;
          findPasswordField.required = true;
          findPasswordField.policyData = this.politicaActual;
        }
      }
    });
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data: IUsuario[] = await this.usuarioService.getUsuarios();
        this.usuarios = Array.isArray(data) ? data : [];
        this.columnasUsuarios = [
          { field: 'idUsuario', header: 'Usuario' },
          { field: 'nombre', header: 'Nombre' },
          { field: 'apellido', header: 'Apellido' },
          { field: 'correoElectronico', header: 'Correo' },
          { field: 'fechaNacimiento', header: 'Fecha de Nacimiento', type: 'text' },
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

  validarPassword(password: string): boolean {
    if (!this.politicaActual || !password) return true;

    if (password.length < this.politicaActual.longitudMinima) {
      this.showErrorAlert(`La contraseña debe tener al menos ${this.politicaActual.longitudMinima} caracteres.`);
      return false;
    }
    return true;
  }

  async guardar() {
    this.executeService({
      callback: async () => {
        if (!this.usuarioActual) { return; }
        const request:UsuarioSaveRequest = {
          idUsuario: this.usuarioActual.idUsuario || '',
          nombre: this.usuarioActual.nombre || '',
          apellido: this.usuarioActual.apellido || '',
          fechaNacimiento: this.usuarioActual.fechaNacimiento || '',
          correoElectronico: this.usuarioActual.correoElectronico || '',
          telefonoMovil: this.usuarioActual.telefonoMovil || '',
          idSucursal: this.usuarioActual.idSucursal || 0,
          idGenero: this.usuarioActual.idGenero || 0,
          idStatusUsuario: this.usuarioActual.idStatusUsuario || 0,
          idRole: this.usuarioActual.idRole || 0,
          pregunta: this.usuarioActual.pregunta || '',
          respuesta: this.usuarioActual.respuesta || '',
          password: this.usuarioActual.password || '',
          isUpdate: this.isUpdate
        }

        await this.usuarioService.guardarUsuario(request);
        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente");
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.usuarioService.eliminarUsuario(this.usuarioActual.idUsuario || '');
          this.limpiarFormulario();
          this.showSuccessAlert('El usuario ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este usuario');
  }

  seleccionarParaEditar(usuario: any) {
    this.isUpdate = true;
    this.usuarioActual = { ...usuario };

    this.findToItemField(this.configuracionCampos, "idUsuario").disabled = true;
    const findPasswordField = this.findToItemField(this.configuracionCampos, "password");
    if (findPasswordField) {
      findPasswordField.hidden = true;
      findPasswordField.required = false;
    }

    if (this.usuarioActual?.idEmpresa) {
      this.alCambiarEmpresa(this.usuarioActual.idEmpresa);
    }
  }

  limpiarFormulario() {
    this.usuarioActual = {};
    this.isUpdate = false;

    this.findToItemField(this.configuracionCampos, "idUsuario").disabled = false;
    const findPasswordField = this.findToItemField(this.configuracionCampos, "password");
    if (findPasswordField) {
      findPasswordField.hidden = true;
      findPasswordField.required = false;
    }

    this.findToItemField(this.configuracionCampos, "idSucursal").options = [];
    this.politicaActual = null;
  }
}