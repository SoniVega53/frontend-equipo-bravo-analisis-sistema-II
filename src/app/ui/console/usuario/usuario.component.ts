import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from '../../base.component';

import { UsuarioService } from '../../../core/services/usuarios.service';
import { GeneroService } from '../../../core/services/genero.service';
import { StatusUsuarioService } from '../../../core/services/status-usuario.service';

import {
  UsuarioCrud,
  UsuarioCrudResponse,
} from '../../../interface/usuario.interface';

import { Genero } from '../../../interface/genero.interface';
import { StatusUsuario } from '../../../interface/status-usuario.interface';

import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';

import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';

import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { SelectOption } from '../../../interface/select-option.interface';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent extends BaseComponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private generoService = inject(GeneroService);
  private statusUsuarioService = inject(StatusUsuarioService);

  usuarios: UsuarioCrudResponse[] = [];

  generos: Genero[] = [];
  statusUsuarios: StatusUsuario[] = [];

  usuarioActual: UsuarioCrud = {
    idUsuario: '',
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    correoElectronico: '',
    telefonoMovil: '',
    idGenero: 0,
    idRole: 0,
    idStatusUsuario: 0,
    idSucursal: 0,
    password: '',
    pregunta: '',
    respuesta: '',
  };

  columnasUsuarios: TableColumn[] = [];

  opcionesGenero: SelectOption[] = [];
  opcionesStatusUsuario: SelectOption[] = [];

  configuracionCampos: DynamicField[] = [
    {
      name: 'idUsuario',
      label: 'ID Usuario',
      type: 'text',
      placeholder: 'ID Usuario',
      required: true,
      disabled: false,
      colSpan: 6,
    },
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Nombre',
      required: true,
      colSpan: 6,
    },
    {
      name: 'apellido',
      label: 'Apellido',
      type: 'text',
      placeholder: 'Apellido',
      required: true,
      colSpan: 6,
    },
    {
      name: 'fechaNacimiento',
      label: 'Fecha de nacimiento',
      type: 'text',
      placeholder: 'AAAA-MM-DD',
      colSpan: 6,
    },
    {
      name: 'correoElectronico',
      label: 'Correo electrónico',
      type: 'email',
      placeholder: 'correo@ejemplo.com',
      required: true,
      colSpan: 6,
    },
    {
      name: 'telefonoMovil',
      label: 'Teléfono móvil',
      type: 'text',
      placeholder: 'Teléfono',
      colSpan: 6,
    },
    {
      name: 'idGenero',
      label: 'Género',
      type: 'dropdown',
      placeholder: 'Seleccione un género',
      required: true,
      options: this.opcionesGenero,
      colSpan: 6,
    },
    {
      name: 'idStatusUsuario',
      label: 'Estatus de usuario',
      type: 'dropdown',
      placeholder: 'Seleccione un estatus',
      required: true,
      options: this.opcionesStatusUsuario,
      colSpan: 6,
    },
    {
      name: 'idRole',
      label: 'Rol',
      type: 'number',
      placeholder: 'ID del rol',
      required: true,
      colSpan: 6,
    },
    {
      name: 'idSucursal',
      label: 'Sucursal',
      type: 'number',
      placeholder: 'ID de sucursal',
      required: true,
      colSpan: 6,
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Contraseña',
      required: true,
      colSpan: 6,
    },
    {
      name: 'pregunta',
      label: 'Pregunta de seguridad',
      type: 'text',
      placeholder: 'Pregunta',
      colSpan: 6,
    },
    {
      name: 'respuesta',
      label: 'Respuesta de seguridad',
      type: 'text',
      placeholder: 'Respuesta',
      colSpan: 6,
    },
  ];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarCatalogos();
      await this.cargarLista();
    });
   
  }

  async cargarCatalogos() {
    this.executeService({
      callback: async () => {

        const generosData: any =
          await this.generoService.getGenero();

        this.generos = Array.isArray(generosData)
          ? generosData
          : [];

        this.opcionesGenero = this.generos.map((genero) => ({
          codigo: genero.idGenero!,
          valor: genero.nombre,
        }));

        const statusData: any =
          await this.statusUsuarioService.getStatusUsuario();

        this.statusUsuarios = Array.isArray(statusData)
          ? statusData
          : [];

        this.opcionesStatusUsuario =
          this.statusUsuarios.map((status) => ({
            codigo: status.idStatusUsuario!,
            valor: status.nombre,
          }));

        const generoField =
          this.findToItemField(
            this.configuracionCampos,
            'idGenero'
          );

        generoField.options = this.opcionesGenero;

        const statusField =
          this.findToItemField(
            this.configuracionCampos,
            'idStatusUsuario'
          );

        statusField.options =
          this.opcionesStatusUsuario;
      },
    });
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {

        const data =
          await this.usuarioService.getUsuarios();

        this.usuarios = Array.isArray(data)
          ? data
          : [];

        this.columnasUsuarios = [
          {
            field: 'idUsuario',
            header: 'ID',
          },
          {
            field: 'nombre',
            header: 'Nombre',
          },
          {
            field: 'apellido',
            header: 'Apellido',
          },
          {
            field: 'correoElectronico',
            header: 'Correo',
          },
          {
            field: 'idGenero',
            header: 'Género',
          },
          {
            field: 'idRole',
            header: 'Rol',
          },
          {
            field: 'idStatusUsuario',
            header: 'Estatus',
          },
          {
            field: 'idSucursal',
            header: 'Sucursal',
          },
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

    if (
      !this.usuarioActual.idUsuario ||
      !this.usuarioActual.nombre ||
      !this.usuarioActual.apellido ||
      !this.usuarioActual.correoElectronico
    ) {
      return;
    }

    this.executeService({
      callback: async () => {

        const esEdicion =
          !!this.usuarioActual.idUsuario &&
          this.usuarios.some(
            (u) =>
              u.idUsuario ===
              this.usuarioActual.idUsuario
          );

        if (esEdicion) {

          await this.usuarioService.actualizarUsuario(
            this.usuarioActual.idUsuario!,
            this.usuarioActual
          );

          this.showSuccessAlert(
            'El usuario se actualizó correctamente.'
          );

        } else {

          await this.usuarioService.crearUsuario(
            this.usuarioActual
          );

          this.showSuccessAlert(
            'El usuario se creó correctamente.'
          );
        }

        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar(id?: string) {

    if (!id) return;

    this.showDeleteConfirm(async () => {

      this.executeService({
        callback: async () => {

          await this.usuarioService.eliminarUsuario(id);

          if (
            this.usuarioActual.idUsuario === id
          ) {
            this.limpiarFormulario();
          }

          this.showSuccessAlert(
            'El usuario ha sido eliminado correctamente.'
          );

          await this.cargarLista();
        },
        showLoading: true,
      });

    }, 'este usuario');
  }

  seleccionarParaEditar(
    usuario: UsuarioCrudResponse
  ) {

    this.usuarioActual = {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fechaNacimiento:
        usuario.fechaNacimiento || '',
      correoElectronico:
        usuario.correoElectronico,
      telefonoMovil:
        usuario.telefonoMovil || '',
      idGenero: usuario.idGenero,
      idRole: usuario.idRole,
      idStatusUsuario:
        usuario.idStatusUsuario,
      idSucursal: usuario.idSucursal,
      intentosDeAcceso:
        usuario.intentosDeAcceso,
      requiereCambiarPassword:
        usuario.requiereCambiarPassword,
    };

    const idField =
      this.findToItemField(
        this.configuracionCampos,
        'idUsuario'
      );

    idField.disabled = true;
  }

  limpiarFormulario() {

    this.usuarioActual = {
      idUsuario: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      correoElectronico: '',
      telefonoMovil: '',
      idGenero: 0,
      idRole: 0,
      idStatusUsuario: 0,
      idSucursal: 0,
      password: '',
      pregunta: '',
      respuesta: '',
    };

    const idField =
      this.findToItemField(
        this.configuracionCampos,
        'idUsuario'
      );

    idField.disabled = false;
  }
}