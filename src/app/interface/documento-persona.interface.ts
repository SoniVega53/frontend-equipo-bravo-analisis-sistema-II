
export interface DocumentoPersona {
  idTipoDocumento: number;
  idPersona: number;
  noDocumento?: string | null;
  fechaCreacion?: string | null;
  usuarioCreacion?: string | null;
  fechaModificacion?: string | null;
  usuarioModificacion?: string | null;

  // Campos para mostrar en la tabla
  nombrePersona?: string;
  nombreTipoDocumento?: string;
}
