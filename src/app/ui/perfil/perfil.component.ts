import { Genero } from './../../interface/genero.interface';
import { Component, OnInit, DoCheck, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { UsuarioResponse } from '../../interface/usuario.interface';
import { DynamicField } from '../../interface/dynamic-field.interface';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { BaseService } from '../../core/services/base.service';
import { UsuarioService } from '../../core/services/usuarios.service';
import { BaseComponent } from '../base.component';
import { GeneroService } from '../../core/services/genero.service';
import { SelectOption } from '../../interface/select-option.interface';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent, LoaderComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent extends BaseComponent implements OnInit, DoCheck {
  usuarioService = inject(UsuarioService);
  private generoService = inject(GeneroService);
  homeComponent = inject(HomeComponent);

  hasChanges = false;

  generos: Genero[] = [];
  optionsGenero: SelectOption[] = [];

  usuarioOriginal: UsuarioResponse | null = null;
  usuarioModel: any = {};

  camposEditables: DynamicField[] = [];
  camposInformativos: DynamicField[] = [];

  ngOnInit() {
    this.cargarPerfil();
    this.homeComponent.isShowMobileMenu = false;
  }

  ngDoCheck() {
    if (this.usuarioOriginal && this.usuarioModel) {
      const currentModelStr = JSON.stringify(this.usuarioModel);
      const originalModelStr = JSON.stringify(this.usuarioOriginal);
      this.hasChanges = currentModelStr !== originalModelStr;
    }
  }

  async cargarPerfil() {
    this.isLoading = true;
    await this.executeService({
      callback: async () => {
        const respones = await this.usuarioService.getPerfil();
        if (respones) {
          this.usuarioOriginal = JSON.parse(JSON.stringify(respones));
          this.usuarioModel = JSON.parse(JSON.stringify(respones));
          if (this.usuarioOriginal?.idGenero) {
            this.usuarioModel['idGenero'] = this.usuarioOriginal.idGenero;
          }

          await this.cargarListaGeneros();
        }
      },
    });
    this.isLoading = false;
  }

  configurarCampos() {
    this.camposEditables = [
      {
        name: 'nombre',
        label: 'Nombre',
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'apellido',
        label: 'Apellido',
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'correoElectronico',
        label: 'Correo Electrónico',
        type: 'email',
        required: true,
        colSpan: 6,
      },
      {
        name: 'telefonoMovil',
        label: 'Teléfono Móvil',
        type: 'text',
        required: true,
        colSpan: 6,
      },
      {
        name: 'fechaNacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date',
        placeholder: 'YYYY-MM-DD',
        required: true,
        colSpan: 6,
      },
      {
        name: 'idGenero',
        label: 'Género',
        type: 'dropdown',
        required: true,
        colSpan: 6,
        options: this.optionsGenero,
      },
    ];

    this.camposInformativos = [
      {
        name: 'empresa',
        label: 'Empresa',
        type: 'text',
        readonly: true,
        disabled: true,
        colSpan: 12,
      },
      {
        name: 'sucursal',
        label: 'Sucursal',
        type: 'text',
        readonly: true,
        disabled: true,
        colSpan: 12,
      },
      {
        name: 'rol',
        label: 'Rol en el Sistema',
        type: 'text',
        readonly: true,
        disabled: true,
        colSpan: 12,
      },
      {
        name: 'ultimaFechaIngreso',
        label: 'Último Ingreso',
        placeholder: 'YYYY-MM-DD',
        type: 'date',
        readonly: true,
        disabled: true,
        colSpan: 12,
      },
    ];
  }

  async cargarListaGeneros() {
    this.executeService({
      callback: async () => {
        const data: any = await this.generoService.getGenero();
        this.generos = Array.isArray(data) ? data : [];
        this.optionsGenero = await this.convertirOption(
          this.generos,
          0,
          {
            codigo: 'idGenero',
            valor: 'nombre',
          },
        );

        this.configurarCampos();
      },
    });
  }

  async guardarPerfil(event: any) {
    this.isLoading = true;
    await this.executeService({
      callback: async () => {
        const respones = await this.usuarioService.putDataPerfil(
          this.usuarioModel,
        );
        this.hasChanges = false;
        if (respones) {
          this.usuarioOriginal = JSON.parse(JSON.stringify(this.usuarioModel));
          this.showSuccessAlert('Se actualizo Correctamente');
        }
      },
    });
  }

  descartarCambios() {
    if (this.usuarioOriginal) {
      this.usuarioModel = JSON.parse(JSON.stringify(this.usuarioOriginal));
      this.hasChanges = false;
    }
  }
}
