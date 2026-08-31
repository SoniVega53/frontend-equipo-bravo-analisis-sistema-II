export interface Empresa {
  idEmpresa?: number;
  nombre: string;
  direccion: string;
  nit: string;

  usuarioCreacion?: string;
  fechaCreacion?: string;

  usuarioModificacion?: string;
  fechaModificacion?: string;
}