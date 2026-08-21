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