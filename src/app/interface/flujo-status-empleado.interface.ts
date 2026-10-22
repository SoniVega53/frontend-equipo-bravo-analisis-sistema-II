export interface FlujoStatusEmpleado {
  idStatusActual?: number;
  nombreStatusActual?: string;
  idStatusNuevo?: number;
  nombreStatusNuevo?: string;
  nombreEvento?: string;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;
}

export interface FlujoStatusEmpleadoSaveRequest {
  idStatusActual: number;
  idStatusNuevo: number;
  nombreEvento: string;
}

export interface TransicionStatusPermitida {
  idStatusActual: number;
  idStatusNuevo: number;
  nombreEvento: string;
}

