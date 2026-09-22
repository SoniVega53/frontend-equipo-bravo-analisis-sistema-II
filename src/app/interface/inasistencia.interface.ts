export interface Inasistencia {
  idInasistencia?: number;
  idEmpleado?: number;
  nombreEmpleado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  motivoInasistencia?: string;
  fechaProcesado?: string | null;
  procesado?: boolean;
  fechaCreacion?: string;
  usuarioCreacio?: string;
}