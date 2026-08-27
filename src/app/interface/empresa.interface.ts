export interface IEmpresa {
  idEmpresa?: number;
  nombre?: string;
  direccion?: string;
  nit?: string;
  
  passwordCantidadMayusculas?: number;
  passwordCantidadMinusculas?: number;
  passwordCantidadCaracteresEspeciales?: number;
  passwordCantidadCaducidadDias?: number;
  passwordLargo?: number;
  passwordIntentosAntesDeBloquear?: number;
  passwordCantidadNumeros?: number;
  passwordCantidadPreguntasValidar?: number;

  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}