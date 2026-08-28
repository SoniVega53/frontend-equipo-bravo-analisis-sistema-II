export interface UsuarioResponse {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  idGenero: number;
  ultimaFechaIngreso: string;
  correoElectronico: string;
  fotografia: string;
  telefonoMovil: string;
  sucursal: string;
  empresa: string;
  rol: string;
}

export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  idGenero: number;
  correoElectronico: string;
  telefonoMovil: string;
}


export interface UsuarioPasswordRequest {
  passwordOld: string;
  passwordNew: string;
}

//
export interface UsuarioCrud {
  idUsuario?: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  correoElectronico: string;
  telefonoMovil?: string;
  idGenero: number;
  idRole: number;
  idStatusUsuario: number;
  idSucursal: number;
  password?: string;
  pregunta?: string;
  respuesta?: string;

  intentosDeAcceso?: number;
  requiereCambiarPassword?: number;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}

export interface UsuarioCrudResponse {
  idUsuario: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  correoElectronico: string;
  telefonoMovil?: string;
  idGenero: number;
  idRole: number;
  idStatusUsuario: number;
  idSucursal: number;
  intentosDeAcceso?: number;
  requiereCambiarPassword?: number;
  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}