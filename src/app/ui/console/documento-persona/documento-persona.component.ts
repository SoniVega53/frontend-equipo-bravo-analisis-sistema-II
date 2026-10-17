import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BaseComponent } from '../../base.component';

import { DocumentoPersonaService } from '../../../core/services/documento-persona.service';
import { PersonaService } from '../../../core/services/persona.service';
import { TipoDocumentoService } from '../../../core/services/tipo-documento.service';

import { DocumentoPersona } from '../../../interface/documento-persona.interface';
import { Persona } from '../../../interface/persona.interface';
import { TipoDocumento } from '../../../interface/tipo-documento.interface';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { SelectOption } from '../../../interface/select-option.interface';

import {
  DynamicTableComponent,
  TableColumn,
} from '../../../shared/dynamic-table/dynamic-table.component';

import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';

@Component({
  selector: 'app-documento-persona',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './documento-persona.component.html',
  styleUrl: './documento-persona.component.css',
})
export class DocumentoPersonaComponent
  extends BaseComponent
  implements OnInit {

  private documentoService = inject(DocumentoPersonaService);
  private personaService = inject(PersonaService);
  private tipoDocumentoService = inject(TipoDocumentoService);

  documentos: DocumentoPersona[] = [];
  personas: Persona[] = [];
  tiposDocumento: TipoDocumento[] = [];

  documentoActual: DocumentoPersona = this.nuevoDocumento();

  columnas: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  // Indica si se está creando o editando un documento.
  private editando = false;

  private nuevoDocumento(): DocumentoPersona {
    return {
      idTipoDocumento: 0,
      idPersona: 0,
      noDocumento: '',
    };
  }

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarDatos();
    });
  }

  async cargarDatos() {
    this.executeService({
      callback: async () => {
        try {
          const [documentos, personas, tipos] = await Promise.all([
            this.documentoService.getDocumentosPersonas(),
            this.personaService.getPersonas(),
            this.tipoDocumentoService.getTiposDocumento(),
          ]);

          this.documentos = Array.isArray(documentos) ? documentos : [];
          this.personas = Array.isArray(personas) ? personas : [];
          this.tiposDocumento = Array.isArray(tipos) ? tipos : [];

          this.configurarCampos();
          this.configurarColumnas();
        } catch (error) {
          console.error(
            'Error al cargar documentos de personas:',
            error
          );
        }
      },
    });
  }

  private configurarCampos() {
    const opcionesPersonas: SelectOption[] = this.personas.map(
      (persona) => ({
        codigo: persona.idPersona,
        valor:
          persona.nombreCompleto ||
          `${persona.nombre ?? ''} ${persona.apellido ?? ''}`.trim() ||
          `Persona #${persona.idPersona}`,
      })
    );

    const opcionesTipos: SelectOption[] = this.tiposDocumento.map(
      (tipo) => ({
        codigo: tipo.idTipoDocumento,
        valor: tipo.nombre,
      })
    );

    this.configuracionCampos = [
      {
        name: 'idPersona',
        label: 'Persona',
        type: 'dropdown',
        placeholder: 'Seleccione una persona',
        required: true,
        options: opcionesPersonas,
        disabled: this.editando,
        colSpan: 7,
      },
      {
        name: 'idTipoDocumento',
        label: 'Tipo de documento',
        type: 'dropdown',
        placeholder: 'Seleccione un tipo de documento',
        required: true,
        options: opcionesTipos,
        disabled: this.editando,
        colSpan: 7,
      },
      {
        name: 'noDocumento',
        label: 'Número de documento',
        type: 'text',
        placeholder: 'Ingrese el número del documento',
        required: true,
        colSpan: 7,
      },
    ];
  }

  private configurarColumnas() {
    this.columnas = [
      {
        field: 'idPersona',
        header: 'ID Persona',
      },
      {
        field: 'nombrePersona',
        header: 'Persona',
      },
      {
        field: 'idTipoDocumento',
        header: 'ID Tipo',
      },
      {
        field: 'nombreTipoDocumento',
        header: 'Tipo de documento',
      },
      {
        field: 'noDocumento',
        header: 'Número de documento',
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

    this.documentos = this.documentos.map((documento) => {
      const persona = this.personas.find(
        (p) => p.idPersona === documento.idPersona
      );

      const tipo = this.tiposDocumento.find(
        (t) => t.idTipoDocumento === documento.idTipoDocumento
      );

      return {
        ...documento,
        nombrePersona: persona
          ? persona.nombreCompleto ||
            `${persona.nombre ?? ''} ${persona.apellido ?? ''}`.trim()
          : `Persona #${documento.idPersona}`,
        nombreTipoDocumento:
          tipo?.nombre ?? `Tipo #${documento.idTipoDocumento}`,
      };
    });
  }

  async guardar() {
    if (
      !this.documentoActual.idPersona ||
      !this.documentoActual.idTipoDocumento ||
      !this.documentoActual.noDocumento?.trim()
    ) {
      this.showErrorAlert(
        'Debe seleccionar una persona, un tipo de documento e ingresar el número del documento.'
      );
      return;
    }

    this.executeService({
      callback: async () => {
        const documento: DocumentoPersona = {
          ...this.documentoActual,
          noDocumento: this.documentoActual.noDocumento!.trim(),
        };

        if (this.editando) {
          await this.documentoService.actualizar(documento);

          this.showSuccessAlert(
            'El documento se actualizó correctamente.'
          );
        } else {
          // El backend también valida que no se repita la combinación.
          const duplicado = this.documentos.some(
            (d) =>
              d.idPersona === documento.idPersona &&
              d.idTipoDocumento === documento.idTipoDocumento
          );

          if (duplicado) {
            this.showErrorAlert(
              'Esta persona ya tiene registrado un documento de ese tipo.'
            );
            return;
          }

          await this.documentoService.crear(documento);

          this.showSuccessAlert(
            'El documento se registró correctamente.'
          );
        }

        this.limpiarFormulario();
        await this.cargarDatos();
      },
      showLoading: true,
    });
  }

  seleccionarParaEditar(documento: DocumentoPersona) {
    this.documentoActual = {
      idPersona: documento.idPersona,
      idTipoDocumento: documento.idTipoDocumento,
      noDocumento: documento.noDocumento ?? '',
      fechaCreacion: documento.fechaCreacion,
      usuarioCreacion: documento.usuarioCreacion,
      fechaModificacion: documento.fechaModificacion,
      usuarioModificacion: documento.usuarioModificacion,
      nombrePersona: documento.nombrePersona,
      nombreTipoDocumento: documento.nombreTipoDocumento,
    };

    this.editando = true;
    this.configurarCampos();
  }

  async eliminar(
    idTipoDocumento?: number,
    idPersona?: number
  ) {
    if (!idTipoDocumento || !idPersona) {
      return;
    }

    this.showDeleteConfirm(
      async () => {
        this.executeService({
          callback: async () => {
            await this.documentoService.eliminar(
              idTipoDocumento,
              idPersona
            );

            if (
              this.documentoActual.idTipoDocumento === idTipoDocumento &&
              this.documentoActual.idPersona === idPersona
            ) {
              this.limpiarFormulario();
            }

            this.showSuccessAlert(
              'El documento se eliminó correctamente.'
            );

            await this.cargarDatos();
          },
          showLoading: true,
        });
      },
      'este documento de persona'
    );
  }

  limpiarFormulario() {
    this.documentoActual = this.nuevoDocumento();
    this.editando = false;
    this.configurarCampos();
  }
}
