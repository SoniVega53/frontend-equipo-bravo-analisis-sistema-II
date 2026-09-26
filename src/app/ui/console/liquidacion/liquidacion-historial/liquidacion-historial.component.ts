import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { LiquidacionService } from '../../../../core/services/liquidacion.service';
import { Liquidacion } from '../../../../interface/liquidacion.interface';
import { DynamicField } from '../../../../interface/dynamic-field.interface';
import { KpiCard, KpiCardsComponent } from '../../../../shared/kpi-cards/kpi-cards.component';
import Swal from 'sweetalert2';
import { LiquidacionComponent } from '../liquidacion.component';

@Component({
  selector: 'app-liquidacion-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, DynamicFormComponent, KpiCardsComponent],
  templateUrl: './liquidacion-historial.component.html'
})
export class LiquidacionHistorialComponent extends BaseComponent implements OnInit {
  private liquidacionService = inject(LiquidacionService);
  private myApp = inject(LiquidacionComponent);

  datosTabla: Liquidacion[] = [];
  columnasTabla: TableColumn[] = [];
  searchTerm: string = '';
  showModal: boolean = false;
  modeloSeleccionado: any = {};
  kpisLiquidacion: KpiCard[] = [];

  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    this.columnasTabla = [...this.myApp.columnasTabla];
    this.configuracionCampos = [...this.myApp.configuracionCampos];
    await this.cargarPermisos(false);
    this.cargarDatos();
  }

  cargarDatos() {
    this.executeService({
      callback: async () => {
        const datos = await this.liquidacionService.obtenerTodas();
        this.datosTabla = this.ordenarGenerico(datos, '', 'idLiquidacion', 'nombreEmpleado');
      },
      showLoading: true
    });
  }

  get filteredOptions(): Liquidacion[] {
    if (!this.searchTerm) return this.datosTabla;
    const term = this.searchTerm.toLowerCase();
    return this.datosTabla.filter(opt => opt?.nombreEmpleado?.toLowerCase().includes(term));
  }

  abrirModal(item: Liquidacion) {
    this.executeService({
      callback: async () => {
        this.modeloSeleccionado = await this.liquidacionService.obtenerPorId(item.idLiquidacion!);
        this.showModal = true;
        this.actualizarKpis();
      },
      showLoading: true
    });
  }

  cerrarModal() {
    this.showModal = false;
    this.modeloSeleccionado = {};
  }

  async actualizarLiquidacion() {
    this.executeService({
      callback: async () => {
        await this.liquidacionService.procesarLiquidacion({ ...this.modeloSeleccionado });
        this.showSuccessAlert('Liquidación actualizada correctamente.');
        this.cerrarModal();
        this.cargarDatos();
      },
      showLoading: true
    });
  }

  async exportarPdf() {
    this.executeService({
      callback: async () => {
        const blob = await this.liquidacionService.generarBoletaPdf(this.modeloSeleccionado.idLiquidacion);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boleta_liquidacion_${this.modeloSeleccionado.idLiquidacion}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      showLoading: true
    });
  }


  async imprimir() {
    try {
      const blob = await this.liquidacionService.generarBoletaPdf(this.modeloSeleccionado.idLiquidacion);
      const url = window.URL.createObjectURL(blob);

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.print();
      };
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al preparar el documento para impresión.',
      });
    }
  }

  actualizarKpis() {
    this.kpisLiquidacion = [
      {
        title: 'Salario Neto',
        value: this.modeloSeleccionado.salarioNeto || 0,
        currency: 'Q',
        icon: 'bi-wallet2',
        colorClass: 'success'
      },
      {
        title: 'Total Ingresos',
        value: this.modeloSeleccionado.totalIngresos || 0,
        currency: 'Q',
        icon: 'bi-graph-up-arrow',
        colorClass: 'success'
      },
      {
        title: 'Total Descuentos',
        value: this.modeloSeleccionado.totalDescuentos || 0,
        currency: 'Q',
        icon: 'bi-graph-down-arrow',
        colorClass: 'danger'
      },
      {
        title: 'Total Neto Liquidado',
        value: this.modeloSeleccionado.totalNeto || 0,
        currency: 'Q',
        icon: 'bi-cash-coin',
        colorClass: 'primary',
        isHighlight: true
      }
    ];
  }
}