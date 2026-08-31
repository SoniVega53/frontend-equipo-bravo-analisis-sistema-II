import { Empresa } from './empresa.interface';

export interface Sucursal {
  idSucursal?: number;
  nombre: string;
  direccion: string;
  idEmpresa?: number; // <-- Agregar esta línea
  empresa?: Empresa;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}