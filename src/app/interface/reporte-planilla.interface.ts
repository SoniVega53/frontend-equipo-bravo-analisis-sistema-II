export interface ReportePlanillaRequest {
  anio: number;
  mes: number;
}

export interface PlanillaDetalle {
  idPlanillaDetalle: number;
  idEmpleado: number;
  nombres: string;
  status: string;
  puesto: string;
  fechaContratacion: string;
  ingresoSueldoBase: number;
  ingresoBonificacionDecreto: number;
  ingresoOtrosIngresos: number;
  descuentoIgss: number;
  descuentoIsr: number;
  descuentoInasistencias: number;
  salarioNeto: number;
}

export interface PlanillaResponse {
  anio: number;
  mes: number;
  totalIngresos: number;
  totalDescuentos: number;
  salarioNeto: number;
  fechaHoraProcesada: string;
  detalles: PlanillaDetalle[];
}