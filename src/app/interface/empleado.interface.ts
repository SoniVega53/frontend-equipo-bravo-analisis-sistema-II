export interface IEmpleado {
  idEmpleado?: number;
  idPersona?: number;
  idSucursal?: number;
  nombreCompleto?: string;
  fechaContratacion?: string;
  idPuesto?: number;
  idStatusEmpleado?: number;
  ingresoSueldoBase?: any;
  ingresoBonificacionDecreto?: any;
  ingresoOtrosIngresos?: any;
  descuentoIgss?: any;
  descuentoIsr?: any;
  descuentoInasistencias?: any;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}
