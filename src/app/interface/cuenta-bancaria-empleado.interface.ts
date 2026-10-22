
export interface CuentaBancariaEmpleado {
  idCuentaBancaria?: number;
  idEmpleado: number;
  idBanco: number;
  numeroDeCuenta: string;
  activa: 'S' | 'N' | '1' | '0';
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;
}
