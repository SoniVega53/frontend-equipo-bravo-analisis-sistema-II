import { Routes } from '@angular/router';
import { WelcomeComponent } from '../../ui/welcome/welcome.component';
import { EmpresaComponent } from '../../ui/console/empresa/empresa.component';
import { GeneroComponent } from '../../ui/console/genero/genero.component';
import { AccesoDenegadoComponent } from '../../ui/acceso-denegado/acceso-denegado.component';
import { NotFoundComponent } from '../../ui/not-found/not-found.component';
import { AsignacionOpcionRoleComponent } from '../../ui/console/asignacion-opcion-role/asignacion-opcion-role.component';
import { UsuarioComponent } from '../../ui/console/usuario/usuario.component';
import { SucursalComponent } from '../../ui/console/sucursal/sucursal.component';
import { StatusUsuarioComponent } from '../../ui/console/status-usuario/status-usuario.component';
import { RoleComponent } from '../../ui/console/role/role.component';
import { ModuloComponent } from '../../ui/console/modulo/modulo.component';
import { MenuComponent } from '../../ui/console/menu/menu.component';
import { OpcionComponent } from '../../ui/console/opcion/opcion.component';
import { RolesComponent } from '../../ui/console/roles/roles.component';

export const CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'sucursal/:code',
    component: SucursalComponent,
  },
  {
    path: 'empresa/:code',
    component: EmpresaComponent,
  },
  {
    path: 'sucursal/:code',
    component: SucursalComponent,
  },
  {
    path: 'genero/:code',
    component: GeneroComponent,
  },
  {
    path: 'status_usuario/:code',
    component: StatusUsuarioComponent,
  },
  {
    path: 'usuario/:code',
    component: UsuarioComponent,
  },
  {
    path: 'role/:code',
    component: RolesComponent,
  },
  {
    path: 'modulo/:code',
    component: ModuloComponent,
  },
  {
    path: 'menu/:code',
    component: MenuComponent,
  },
  {
    path: 'opcion/:code',
    component: OpcionComponent,
  },
  {
    path: 'asignacion_opcion_role/:code',
    component: AsignacionOpcionRoleComponent,
  },
  {
    path: '403',
    component: AccesoDenegadoComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];