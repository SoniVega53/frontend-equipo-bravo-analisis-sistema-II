import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent, TableColumn } from '../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../shared/dynamic-form/dynamic-form.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { BancoService } from '../../../core/services/banco.service';
import { IBanco } from '../../../interface/banco.interface';

@Component({
  selector: 'app-banco',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicTableComponent,
    DynamicFormComponent,
    LoaderComponent,
    CollapsedCardComponent,
  ],
  templateUrl: './banco.component.html',
  styleUrl: './banco.component.css',
})
export class BancoComponent extends BaseComponent implements OnInit {
  private bancoService = inject(BancoService);

  bancos: IBanco[] = [];
  bancoActual: IBanco = {};
  isUpdate: boolean = false;

  columnas: TableColumn[] = [];
  configuracionCampos: DynamicField[] = [
    { name: 'nombre', label: 'Nombre del Banco', type: 'text', placeholder: 'Ej: BANCO INDUSTRIAL', required: true, colSpan: 7 },
  ];

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      await this.cargarLista();
    });
  }

  async cargarLista() {
    this.executeService({
      callback: async () => {
        const data = await this.bancoService.getBanco();
        this.bancos = Array.isArray(data) ? data : [];
        this.columnas = [
          { field: 'idBanco', header: 'ID' },
          { field: 'nombre', header: 'Nombre' },
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
    if (!this.bancoActual?.nombre?.trim()) return;

    this.executeService({
      callback: async () => {
        await this.bancoService.crearToActualizar(this.bancoActual);

        this.showSuccessAlert(this.isUpdate ? 'Se Actualizó Correctamente' : 'Se Guardó Correctamente');
        this.limpiarFormulario();
        await this.cargarLista();
      },
      showLoading: true,
    });
  }

  async eliminar() {
    if (!this.isUpdate || !this.bancoActual?.idBanco) return;

    this.showDeleteConfirm(async () => {
      this.executeService({
        callback: async () => {
          await this.bancoService.eliminar(this.bancoActual.idBanco!);
          this.limpiarFormulario();
          this.showSuccessAlert('El banco ha sido eliminado correctamente.');
          await this.cargarLista();
        },
        showLoading: true,
      });
    }, 'este banco');
  }

  seleccionarParaEditar(item: any) {
    this.isUpdate = true;
    this.bancoActual = { ...item };
  }

  limpiarFormulario() {
    this.bancoActual = {};
    this.isUpdate = false;
  }
}
