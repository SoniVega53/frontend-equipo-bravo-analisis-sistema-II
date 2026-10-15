export interface StatusEmpleado {
  idStatusEmpleado: number;
  nombre: string;
}

export interface FlujoStatusEmpleado {
  idStatusActual: number;
  idStatusNuevo: number;
  nombreEvento?: string;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}
