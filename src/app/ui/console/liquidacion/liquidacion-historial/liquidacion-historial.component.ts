import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../../shared/dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { LiquidacionService } from '../../../../core/services/liquidacion.service';
import { Liquidacion } from '../../../../interface/liquidacion.interface';
import { DynamicField } from '../../../../interface/dynamic-field.interface';
import { SelectOption } from '../../../../interface/select-option.interface';
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
  kpisDesglose: KpiCard[] = [];
  motivosEgreso: any[] = [];

  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    this.columnasTabla = [...this.myApp.columnasTabla];
    this.configuracionCampos = [...this.myApp.configuracionCampos];
    await this.cargarPermisos(false);
    this.cargarCatalogos();
    this.cargarDatos();
  }

  cargarCatalogos() {
    this.executeService({
      callback: async () => {
        this.motivosEgreso = await this.catalogoService.getMotivosEgreso();
        const statusEmpleados = await this.catalogoService.getStatusLiquidacion();

        const fieldStatus = this.findToItemField(this.configuracionCampos, 'idStatusEmpleado');
        fieldStatus.options = this.ordenarGenerico(statusEmpleados, '', 'codigo', 'valor');

        // Asignar EventEmitter para detectar cambios en idStatusEmpleado
        if (!fieldStatus.onChange) {
          fieldStatus.onChange = new EventEmitter<any>();
          fieldStatus.onChange.subscribe((idEstado: any) => {
             this.alCambiarEstado(idEstado, statusEmpleados);
          });
        }

        this.findToItemField(this.configuracionCampos, 'motivoEgreso').options = this.ordenarGenerico(this.motivosEgreso, '', 'codigo', 'valor');
      }
    });
  }

  alCambiarEstado(idEstado: any, statusEmpleados: SelectOption[], isLoad: boolean = false) {
    const statusObj = statusEmpleados.find(s => s.codigo == idEstado);
    const nombreStatus = statusObj ? statusObj.valor.toUpperCase() : '';

    const fieldMotivo = this.findToItemField(this.configuracionCampos, 'motivoEgreso');
    
    if (nombreStatus === 'BAJA') {
      const renuncia = this.motivosEgreso.find(m => m.valor.toUpperCase().includes('RENUNCIA'));
      fieldMotivo.options = this.ordenarGenerico(this.motivosEgreso, '', 'codigo', 'valor');
      fieldMotivo.disabled = true;
      if (renuncia && !isLoad) {
        this.modeloSeleccionado.motivoEgreso = renuncia.codigo;
      }
    } else if (nombreStatus === 'DESPEDIDO' || nombreStatus === 'DESPIDO') {
      const permitidos = this.motivosEgreso.filter(m => m.valor.toUpperCase().includes('JUBILACI') || m.valor.toUpperCase().includes('DESPIDO'));
      fieldMotivo.options = this.ordenarGenerico(permitidos, '', 'codigo', 'valor');
      fieldMotivo.disabled = false;
      if (!isLoad) {
        this.modeloSeleccionado.motivoEgreso = null;
      }
    } else {
      fieldMotivo.options = this.ordenarGenerico(this.motivosEgreso, '', 'codigo', 'valor');
      fieldMotivo.disabled = false;
    }
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
        const data = await this.liquidacionService.obtenerPorId(item.idLiquidacion!);
        
        const code = this.motivosEgreso.find(m => m.valor.toString() === data.motivoEgreso)?.codigo;
        data.motivoEgreso = code || data.motivoEgreso;

        this.modeloSeleccionado = data;

        const statusEmpleados = this.findToItemField(this.configuracionCampos, 'idStatusEmpleado').options || [];
        if (data.idStatusEmpleado) {
          this.alCambiarEstado(data.idStatusEmpleado, statusEmpleados, true);
        }

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
        const result = await this.liquidacionService.procesarLiquidacion({ ...this.modeloSeleccionado });
        this.modeloSeleccionado = { ...result };
        this.actualizarKpis();
        this.showSuccessAlert('Liquidación actualizada correctamente.');
        this.cargarDatos();
        // Option to close or keep modal open: we will keep the current behavior which is close, but we updated model.
        this.cerrarModal();
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

    this.kpisDesglose = [
      { title: 'Indemnización', value: this.modeloSeleccionado.montoIndemnizacion || 0, currency: 'Q', icon: 'bi-shield-check', colorClass: 'info' },
      { title: 'Aguinaldo', value: this.modeloSeleccionado.montoAguinaldo || 0, currency: 'Q', icon: 'bi-gift', colorClass: 'info' },
      { title: 'Bono 14', value: this.modeloSeleccionado.montoBono14 || 0, currency: 'Q', icon: 'bi-calendar-check', colorClass: 'info' },
      { title: 'Vacaciones', value: this.modeloSeleccionado.montoVacaciones || 0, currency: 'Q', icon: 'bi-sun', colorClass: 'info' },
      { title: 'Salario Pendiente', value: this.modeloSeleccionado.montoSalarioPendiente || 0, currency: 'Q', icon: 'bi-clock-history', colorClass: 'warning' }
    ];
  }
}