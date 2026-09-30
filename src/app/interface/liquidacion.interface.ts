export interface EmpleadoBase {
  idEmpleado: number;
  idPersona?: number;
  nombreEmpleado?: string;
  idPuesto?: number;
  nombrePuesto?: string;
  idDepartamento?: number;
  nombreDepartamento?: string;
  idSucursal?: number;
  idStatusEmpleado?: number;
  nombreStatus?: string;
  fechaContratacion?: string;
  ingresoSueldoBase?: number;
  ingresoBonificacionDecreto?: number;
  ingresoOtrosIngresos?: number;
  descuentoIgss?: number;
  descuentoIsr?: number;
  descuentoInasistencias?: number;
}

export interface Liquidacion {
  idLiquidacion?: number;
  idEmpleado: number;
  nombreEmpleado?: string;
  fechaContratacion?: string;
  fechaEgreso?: string;
  fechaLiquidacion?: string;
  motivoEgreso?: string;
  idPuesto?: number;
  nombrePuesto?: string;
  idDepartamento?: number;
  nombreDepartamento?: string;
  idStatusEmpleado?: number;
  nombreStatus?: string;
  ingresoSueldoBase?: number;
  ingresoBonificacionDecreto?: number;
  ingresoOtrosIngresos?: number;
  descuentoIgss?: number;
  descuentoIsr?: number;
  descuentoInasistencias?: number;
  salarioNeto?: number;
  totalIngresos?: number;
  totalDescuentos?: number;
  totalNeto?: number;
  fechaCreacion?: string;

  // Campos calculados en tiempo de ejecución (Desglose Guatemala)
  diasLaboradosTotal?: number;
  montoIndemnizacion?: number;
  diasProporcionalesAguinaldo?: number;
  montoAguinaldo?: number;
  diasProporcionalesBono14?: number;
  montoBono14?: number;
  diasProporcionalesVacaciones?: number;
  montoVacaciones?: number;
  diasPendientesPago?: number;
  montoSalarioPendiente?: number;

  calcularSalarioPendiente?: boolean | string;
  calcularAguinaldo?: boolean | string;
  calcularBono14?: boolean | string;
  calcularVacaciones?: boolean | string;
  calcularIndemnizacion?: boolean | string;
}