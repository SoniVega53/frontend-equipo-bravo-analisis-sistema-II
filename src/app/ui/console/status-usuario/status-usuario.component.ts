import { Component, inject, OnInit } from '@angular/core';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { CollapsedCardComponent } from "../../../shared/collapsed-card/collapsed-card.component";
import { DynamicFormComponent } from "../../../shared/dynamic-form/dynamic-form.component";
import { DynamicTableComponent, TableColumn } from "../../../shared/dynamic-table/dynamic-table.component";
import { BaseComponent } from '../../base.component';
import { StatusUsuarioService } from '../../../core/services/status-usuario.service';
import { StatusUsuario } from '../../../interface/usuario.interface';
import { DynamicField } from '../../../interface/dynamic-field.interface';

@Component({
  selector: 'app-status-usuario',
  standalone: true,
  imports: [LoaderComponent, CollapsedCardComponent, DynamicFormComponent, DynamicTableComponent],
  templateUrl: './status-usuario.component.html',
  styleUrl: './status-usuario.component.css'
})
export class StatusUsuarioComponent extends BaseComponent implements OnInit {
  private statusUsuarioService = inject(StatusUsuarioService);

  statusUsuarioList: StatusUsuario[] = [];
  modelStatusUsuario: StatusUsuario = {};

  isUpdate: boolean = false;

  columnasTabla: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    await this.cargarPermisos();
    this.configurarCampos();
    await this.cargarLista();
  }

  configurarCampos() {
    this.configuracionCampos = [
      {name: 'idStatusUsuario', label: 'ID Status Usuario', type: 'text', placeholder: 'idStatusUsuario', disabled: true, colSpan: 7, hidden: true},
      { name: 'nombre', label: 'Nombre', type: 'text', required: true, colSpan: 7 },
    ];
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.statusUsuarioService.getStatusUsuarios();
        this.statusUsuarioList = Array.isArray(data) ? data : [];
        this.columnasTabla = [
          { field: 'idStatusUsuario', header: 'ID' },
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
        if (!this.modelStatusUsuario) return;

        await this.statusUsuarioService.crearToActualizar(this.modelStatusUsuario);

        this.showSuccessAlert(this.isUpdate ? "Se Actualizó Correctamente" : "Se Guardó Correctamente");
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.modelStatusUsuario?.idStatusUsuario) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.statusUsuarioService.eliminar(this.modelStatusUsuario?.idStatusUsuario);
          this.limpiarFormulario();
          this.showSuccessAlert('El status de usuario ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este status de usuario');
  }

  seleccionarParaEditar(empresa: any) {
    this.isUpdate = true;
    this.modelStatusUsuario = { ...empresa };

    if (this.modelStatusUsuario.idStatusUsuario) {
      this.findToItemField(this.configuracionCampos,"idStatusUsuario").hidden = false;
    }
  }

  limpiarFormulario() {
    if (this.modelStatusUsuario.idStatusUsuario) {
      this.findToItemField(this.configuracionCampos,"idStatusUsuario").hidden = true;
    }
    this.modelStatusUsuario = {};
    this.isUpdate = false;
  }
}
