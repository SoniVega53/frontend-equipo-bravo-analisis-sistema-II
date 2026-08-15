export interface RoleOpciones {
  consultar?: boolean;
  alta?: boolean;
  baja?: boolean;
  cambio?: boolean;
  imprimir?: boolean;
  exportar?: boolean;
}

export interface RoleOpcionTabla {
  idRole: number;
  idOpcion: number;
  nombreOpcion: string;
  consultar: number;
  alta: number;
  baja: number;
  cambio: number;
  imprimir: number;
  exportar: number;
}

export interface RolItem {
  idRole?: number;
  nombre?: string;
}

export interface ModuloItem {
  idModulo?: number;
  nombre?: string;
  ordenMenu?: number;
}

export interface ListadoOpcionesItem {
  modulos: ModuloItem[];
  roles: RolItem[];
}