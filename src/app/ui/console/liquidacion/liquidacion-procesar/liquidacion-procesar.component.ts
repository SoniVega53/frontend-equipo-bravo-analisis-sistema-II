import { Component, EventEmitter, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseComponent } from '../../../base.component';
import { DynamicTableComponent, TableColumn } from '../../../../shared/dynamic-table/dynamic-table.component';
import { CollapsedCardComponent } from '../../../../shared/collapsed-card/collapsed-card.component';
import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';
import { DropdownSelectComponent } from '../../../../shared/dropdown-select/dropdown-select.component';
import { LiquidacionService } from '../../../../core/services/liquidacion.service';
import { DynamicField } from '../../../../interface/dynamic-field.interface';
import { EmpleadoBase, Liquidacion } from '../../../../interface/liquidacion.interface';
import { KpiCard, KpiCardsComponent } from '../../../../shared/kpi-cards/kpi-cards.component';
import Swal from 'sweetalert2';
import { LiquidacionComponent } from '../liquidacion.component';
import { SelectOption } from '../../../../interface/select-option.interface';

@Component({
  selector: 'app-liquidacion-procesar',
  standalone: true,
  imports: [CommonModule, FormsModule, DynamicTableComponent, CollapsedCardComponent, DynamicFormComponent, DropdownSelectComponent, KpiCardsComponent],
  templateUrl: './liquidacion-procesar.component.html'
})
export class LiquidacionProcesarComponent extends BaseComponent implements OnInit {
  @ViewChild('collapseCard') collapseCard!: CollapsedCardComponent;

  private liquidacionService = inject(LiquidacionService);
  private myApp = inject(LiquidacionComponent);

  modeloFormulario: any = {};
  historialEmpleado: Liquidacion[] = [];
  motivosEgreso: SelectOption[] = [];
  empleadoBase: EmpleadoBase | null = null;
  columnasTabla: TableColumn[] = [];
  empleadoSeleccionado: number | null = null;

  currentPage: number = 1;
  kpisLiquidacion: KpiCard[] = [];
  kpisDesglose: KpiCard[] = [];

  calcular: any = {
      calcularIndemnizacion: true,
      calcularSalarioPendiente: true,
      calcularAguinaldo: true,
      calcularBono14: true,
      calcularVacaciones: true,
  }

  campoEmpleado: DynamicField = {
    name: 'idEmpleado', label: 'Seleccionar Empleado', type: 'dropdown', required: true, options: []
  };

  configuracionCampos: DynamicField[] = [];

  async ngOnInit() {
    this.columnasTabla = [...this.myApp.columnasTabla];
    this.configuracionCampos = [...this.myApp.configuracionCampos];

    await this.cargarPermisos(false);
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.executeService({
      callback: async () => {
        const empleados = await this.catalogoService.getEmpleados(false);
        const statusEmpleados = await this.catalogoService.getStatusLiquidacion();
        this.motivosEgreso = await this.catalogoService.getMotivosEgreso();
        this.campoEmpleado.options = this.ordenarGenerico(empleados, '', 'codigo', 'valor');

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
        this.findToItemField(this.configuracionCampos, 'nombreEmpleado').hidden = true;
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
        this.modeloFormulario.motivoEgreso = renuncia.codigo;
      }
    } else if (nombreStatus === 'DESPEDIDO' || nombreStatus === 'DESPIDO') {
      const permitidos = this.motivosEgreso.filter(m => m.valor.toUpperCase().includes('JUBILACI') || m.valor.toUpperCase().includes('DESPIDO'));
      fieldMotivo.options = this.ordenarGenerico(permitidos, '', 'codigo', 'valor');
      fieldMotivo.disabled = false;
      if (!isLoad) {
        this.modeloFormulario.motivoEgreso = null; 
      }
    } else {
      fieldMotivo.options = this.ordenarGenerico(this.motivosEgreso, '', 'codigo', 'valor');
      fieldMotivo.disabled = false;
    }
  }

  onEmpleadoSelected(id: number,isSlect: boolean = false) {
    console.log('Empleado seleccionado:', id);
    this.empleadoSeleccionado = id;
    this.limpiarFormulario();
    if (!id) {
      return;
    }
    this.executeService({
      callback: async () => {
        const empleado = await this.liquidacionService.getEmpleadoBase(id);
        const historial = await this.liquidacionService.obtenerPorEmpleadoHistorial(id);

        this.empleadoBase = empleado;
        console.log('Empleado base:', empleado);
        this.historialEmpleado = this.ordenarGenerico(historial, '', 'idLiquidacion', 'nombreEmpleado');
        if (!isSlect) {
          this.modeloFormulario = {
            ...empleado
          };
          
          const statusEmpleados = this.findToItemField(this.configuracionCampos, 'idStatusEmpleado').options || [];
          if (empleado.idStatusEmpleado) {
            // Pasamos isLoad = false para forzar la autoselección del motivo según el estado base del empleado
            this.alCambiarEstado(empleado.idStatusEmpleado, statusEmpleados, false);
          }
        }
        
      },
      showLoading: true
    });
  }

  actualizarKpis() {
    this.kpisLiquidacion = [
      {
        title: 'Salario Neto',
        value: this.modeloFormulario.salarioNeto || 0,
        currency: 'Q',
        icon: 'bi-wallet2',
        colorClass: 'success'
      },
      {
        title: 'Total Ingresos',
        value: this.modeloFormulario.totalIngresos || 0,
        currency: 'Q',
        icon: 'bi-graph-up-arrow',
        colorClass: 'success'
      },
      {
        title: 'Total Descuentos',
        value: this.modeloFormulario.totalDescuentos || 0,
        currency: 'Q',
        icon: 'bi-graph-down-arrow',
        colorClass: 'danger'
      },
      {
        title: 'Total Neto Liquidado',
        value: this.modeloFormulario.totalNeto || 0,
        currency: 'Q',
        icon: 'bi-cash-coin',
        colorClass: 'primary',
        isHighlight: true
      }
    ];

    this.kpisDesglose = [
      { title: 'Indemnización', value: this.modeloFormulario.montoIndemnizacion || 0, currency: 'Q', icon: 'bi-shield-check', colorClass: 'info', hidden: !this.calcular.calcularIndemnizacion },
      { title: 'Aguinaldo', value: this.modeloFormulario.montoAguinaldo || 0, currency: 'Q', icon: 'bi-gift', colorClass: 'info', hidden: !this.calcular.calcularAguinaldo },
      { title: 'Bono 14', value: this.modeloFormulario.montoBono14 || 0, currency: 'Q', icon: 'bi-calendar-check', colorClass: 'info', hidden: !this.calcular.calcularBono14 },
      { title: 'Vacaciones', value: this.modeloFormulario.montoVacaciones || 0, currency: 'Q', icon: 'bi-sun', colorClass: 'info', hidden: !this.calcular.calcularVacaciones},
      { title: 'Salario Pendiente', value: this.modeloFormulario.montoSalarioPendiente || 0, currency: 'Q', icon: 'bi-clock-history', colorClass: 'warning', hidden: !this.calcular.calcularSalarioPendiente }
    ];
  }

  seleccionarRegistro(item: Liquidacion) {
    
    const code = this.motivosEgreso.find(m => m.valor.toString() === item.motivoEgreso)?.codigo;
    item.motivoEgreso = code || item.motivoEgreso;

    this.collapseCard.isFormCollapsed = false;
    this.empleadoSeleccionado = item.idEmpleado;
    this.modeloFormulario = { ...item };

    const statusEmpleados = this.findToItemField(this.configuracionCampos, 'idStatusEmpleado').options || [];
    if (item.idStatusEmpleado) {
      this.alCambiarEstado(item.idStatusEmpleado, statusEmpleados, true);
    }

    this.actualizarKpis();
    //this.onEmpleadoSelected(item.idEmpleado,true);
  }

  async procesarLiquidacion() {
    this.executeService({
      callback: async () => {
        const request = { ...this.modeloFormulario, ...this.calcular };
        

        const result = await this.liquidacionService.procesarLiquidacion(request);
        this.modeloFormulario = { ...result };
        this.actualizarKpis();
        this.showSuccessAlert('Liquidación procesada correctamente.');
        // Refresh history
        this.onEmpleadoSelected(this.empleadoSeleccionado!);
      },
      showLoading: true
    });
  }

  async exportarPdf() {
    this.executeService({
      callback: async () => {
        const blob = await this.liquidacionService.generarBoletaPdf(this.modeloFormulario.idLiquidacion);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boleta_liquidacion_${this.modeloFormulario.idLiquidacion}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      showLoading: true
    });
  }

  
  async imprimir() {  
    try {
      const blob = await this.liquidacionService.generarBoletaPdf(this.modeloFormulario.idLiquidacion);
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

  limpiarFormulario() {
    this.modeloFormulario = {};
    this.historialEmpleado = [];
    this.kpisLiquidacion = [];
    this.kpisDesglose = [];

    const fieldMotivo = this.findToItemField(this.configuracionCampos, 'motivoEgreso');
    if (fieldMotivo && this.motivosEgreso.length > 0) {
      fieldMotivo.options = this.ordenarGenerico(this.motivosEgreso, '', 'codigo', 'valor');
      fieldMotivo.disabled = false;
    }
  }

  cancelar() {
    this.modeloFormulario = {
      ...this.empleadoBase
    };
    this.kpisLiquidacion = [];
    this.kpisDesglose = [];

    const statusEmpleados = this.findToItemField(this.configuracionCampos, 'idStatusEmpleado').options || [];
    if (this.empleadoBase?.idStatusEmpleado) {
      this.alCambiarEstado(this.empleadoBase.idStatusEmpleado, statusEmpleados, false);
    }
  }

   onSearchChange() {
    this.currentPage = 1;
  }

}