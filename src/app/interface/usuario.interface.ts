import { PasswordPolicy } from "./password-policy";

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

export interface PreguntaSeguridadResponse {
  pregunta: string;
  politica: PasswordPolicy;
}

export interface UsuarioSaveRequest {
  idUsuario: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  correoElectronico: string;
  telefonoMovil: string;
  password?: string;
  pregunta: string;
  respuesta: string;
  requiereCambiarPassword?: number;
  idSucursal: number;
  idRole: number;
  idStatusUsuario: number;
  idGenero: number;
  isUpdate: boolean;
}

export interface IUsuario {
  idUsuario?: string;
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  idStatusUsuario?: number;
  idGenero?: number;
  intentosDeAcceso?: number;
  sesionActual?: string;
  correoElectronico?: string;
  requiereCambiarPassword?: number;
  fotografia?: string;
  telefonoMovil?: string;
  idSucursal?: number;
  pregunta?: string;
  respuesta?: string;
  idRole?: number;
  idEmpresa?: number;

  password?: string;
  confirmarPassword?: string;

  fechaCreacion?: string;
  usuarioCreacion?: string;
  fechaModificacion?: string;
  usuarioModificacion?: string;
}