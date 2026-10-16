import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { CollapsedCardComponent } from '../../../shared/collapsed-card/collapsed-card.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { DynamicField } from '../../../interface/dynamic-field.interface';
import { DropdownSelectComponent } from '../../../shared/dropdown-select/dropdown-select.component';
import { ReportePlanillaService } from '../../../core/services/reporte-planilla.service';
import { BoletaPagoService } from '../../../core/services/boleta-pago.service';
import { PlanillaDetalle } from '../../../interface/reporte-planilla.interface';
import { BoletaPagoRequest } from '../../../interface/boleta-pago.interface';

@Component({
  selector: 'app-boleta-pago',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CollapsedCardComponent,
    LoaderComponent,
    DropdownSelectComponent,
  ],
  templateUrl: './boleta-pago.component.html',
  styleUrl: './boleta-pago.component.css',
})
export class BoletaPagoComponent extends BaseComponent implements OnInit {
  private reportePlanillaService = inject(ReportePlanillaService);
  private boletaPagoService = inject(BoletaPagoService);

  modeloDate: any;
  idEmpleadoSeleccionado: number | null = null;
  empleadosPeriodo: PlanillaDetalle[] = [];

  fieldDate: DynamicField = {
    name: 'periodoSeleccionado',
    label: 'Período de Planilla (Mes y Año)',
    type: 'dropdown',
    required: true,
    colSpan: 12,
    options: [],
  };

  async ngOnInit() {
    await this.onChangeViewURL(async () => {
      this.cargarPeriodosDropdown();
    });
  }

  async cargarPeriodosDropdown() {
    this.executeService({
      callback: async () => {
        const periodos = await this.catalogoService.getPeriodosPlanilla();
        this.fieldDate.options = periodos;
      },
    });
  }

  actionMonthSelected(event: string) {
    this.idEmpleadoSeleccionado = null;
    this.empleadosPeriodo = [];
    this.cargarEmpleadosDelPeriodo();
  }

  async cargarEmpleadosDelPeriodo() {
    this.executeService({
      callback: async () => {
        if (!this.modeloDate) return;
        const [anioStr, mesStr] = this.modeloDate.split('-');
        const response = await this.reportePlanillaService.generarReporte({
          anio: parseInt(anioStr, 10),
          mes: parseInt(mesStr, 10),
        });
        this.empleadosPeriodo = this.ordenarGenerico(response.detalles || [], '', 'idEmpleado', 'nombres');
      },
      callbackError: async (error) => {
        this.empleadosPeriodo = [];
        this.showErrorAlert(error?.mensaje || 'No hay planilla procesada para el periodo seleccionado.');
      },
      showLoading: true,
    });
  }

  get detalleSeleccionado(): PlanillaDetalle | undefined {
    return this.empleadosPeriodo.find((e) => e.idEmpleado === this.idEmpleadoSeleccionado);
  }

  get totalIngresos(): number {
    const d = this.detalleSeleccionado;
    if (!d) return 0;
    return (d.ingresoSueldoBase || 0) + (d.ingresoBonificacionDecreto || 0) + (d.ingresoOtrosIngresos || 0);
  }

  get totalDescuentos(): number {
    const d = this.detalleSeleccionado;
    if (!d) return 0;
    return (d.descuentoIgss || 0) + (d.descuentoIsr || 0) + (d.descuentoInasistencias || 0);
  }

  private armarRequest(): BoletaPagoRequest | null {
    if (!this.modeloDate || !this.idEmpleadoSeleccionado) return null;
    const [anioStr, mesStr] = this.modeloDate.split('-');
    return {
      anio: parseInt(anioStr, 10),
      mes: parseInt(mesStr, 10),
      idEmpleado: this.idEmpleadoSeleccionado,
    };
  }

  async descargarPdf() {
    this.executeService({
      callback: async () => {
        const request = this.armarRequest();
        if (!request) return;
        const blob = await this.boletaPagoService.generarPdf(request);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boleta_pago_${request.anio}_${request.mes}_emp${request.idEmpleado}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      callbackError: async () => {
        this.showErrorAlert('Ocurrió un error al generar la boleta de pago.');
      },
      showLoading: true,
    });
  }

  async imprimirPdf() {
    this.executeService({
      callback: async () => {
        const request = this.armarRequest();
        if (!request) return;
        const blob = await this.boletaPagoService.generarPdf(request);
        const url = window.URL.createObjectURL(blob);
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
      },
      callbackError: async () => {
        this.showErrorAlert('Ocurrió un error al preparar la boleta para impresión.');
      },
      showLoading: true,
    });
  }
}