
export interface CuentaBancariaEmpleado {
  idCuentaBancaria?: number;
  idEmpleado: number;
  idBanco: number;
  numeroDeCuenta: string;
  activa: 'S' | 'N';
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;
}
