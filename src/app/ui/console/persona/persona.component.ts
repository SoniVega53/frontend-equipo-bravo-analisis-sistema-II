import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { SelectOption } from '../../../interface/select-option.interface';
import { PersonaService } from '../../../core/services/persona.service';
import { IPersona } from '../../../interface/persona.interface';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './persona.component.html',
  styleUrl: './persona.component.css',
})
export class PersonaComponent extends BaseComponent implements OnInit {
  private personaService = inject(PersonaService);

  personas: any[] = [];
  personaActual: IPersona = {};
  isUpdate: boolean = false;

  optionsGenero: SelectOption[] = [];
  optionsEstadoCivil: SelectOption[] = [];

  columnas: TableColumn[] = [];
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
        this.optionsGenero = await this.catalogoService.getGeneros();
        this.optionsEstadoCivil = await this.catalogoService.getEstadosCiviles();
        this.configurarCampos();
      },
    });
  }

  configurarCampos() {
    this.configuracionCampos = [
      { name: 'nombre', label: 'Nombre', type: 'text', placeholder: 'Ej: María', required: true, colSpan: 6 },
      { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Ej: López', required: true, colSpan: 6 },
      { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', required: true, colSpan: 4 },
      { name: 'idGenero', label: 'Género', type: 'dropdown', required: true, colSpan: 4, options: this.optionsGenero },
      { name: 'idEstadoCivil', label: 'Estado Civil', type: 'dropdown', required: true, colSpan: 4, options: this.optionsEstadoCivil },
      { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ej: 5555-1234', required: true, colSpan: 4 },
      { name: 'correoElectronico', label: 'Correo Electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: false, colSpan: 4 },
      { name: 'direccion', label: 'Dirección', type: 'text', required: true, colSpan: 4 },
    ];
  }

  private nombreOpcion(options: SelectOption[], codigo: any): string {
    return options.find((o) => o.codigo == codigo)?.valor || '-';
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.personaService.getPersona();
        this.personas = (Array.isArray(data) ? data : []).map((p: any) => ({
          ...p,
          nombreCompleto: `${p.nombre} ${p.apellido}`,
          genero: this.nombreOpcion(this.optionsGenero, p.idGenero),
          estadoCivil: this.nombreOpcion(this.optionsEstadoCivil, p.idEstadoCivil),
        }));
        this.columnas = [
          { field: 'idPersona', header: 'ID' },
          { field: 'nombreCompleto', header: 'Nombre' },
          { field: 'fechaNacimiento', header: 'Fecha de Nacimiento' },
          { field: 'genero', header: 'Género' },
          { field: 'estadoCivil', header: 'Estado Civil' },
          { field: 'telefono', header: 'Teléfono' },
          { field: 'correoElectronico', header: 'Correo' },
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

  async guardar() {
    if (!this.personaActual?.nombre?.trim() || !this.personaActual?.apellido?.trim()) return;

    this.executeService({
      callback: async () => {
        await this.personaService.crearToActualizar(this.personaActual);

        this.showSuccessAlert(this.isUpdate ? 'Se Actualizó Correctamente' : 'Se Guardó Correctamente');
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.personaActual?.idPersona) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.personaService.eliminar(this.personaActual.idPersona!);
          this.limpiarFormulario();
          this.showSuccessAlert('La persona ha sido eliminada correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'esta persona');
  }

  seleccionarParaEditar(item: any) {
    this.isUpdate = true;
    this.personaActual = {
      idPersona: item.idPersona,
      nombre: item.nombre,
      apellido: item.apellido,
      fechaNacimiento: item.fechaNacimiento,
      idGenero: item.idGenero,
      direccion: item.direccion,
      telefono: item.telefono,
      correoElectronico: item.correoElectronico,
      idEstadoCivil: item.idEstadoCivil,
    };
  }

  limpiarFormulario() {
    this.personaActual = {};
    this.isUpdate = false;
  }
}
