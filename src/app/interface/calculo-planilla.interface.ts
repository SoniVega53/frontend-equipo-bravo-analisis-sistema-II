export interface PlanillaRequest {
  anio?: number;
  mes?: number;
  forzarRecalculo?: boolean;
}

export interface PlanillaDetalle {
  idPlanillaDetalle?: number;
  idEmpleado?: number;
  fechaContratacion?: string;
  nombres?: string;
  ingresoSueldoBase?: number;
  ingresoBonificacionDecreto?: number;
  ingresoOtrosIngresos?: number;
  descuentoIgss?: number;
  descuentoIsr?: number;
  descuentoInasistencias?: number;
  salarioNeto?: number;
}

export interface PlanillaResponse {
  anio?: number;
  mes?: number;
  totalIngresos?: number;
  totalDescuentos?: number;
  salarioNeto?: number;
  fechaHoraProcesada?: string;
  detalles?: PlanillaDetalle[];
}