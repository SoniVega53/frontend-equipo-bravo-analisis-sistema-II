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

export const CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'empresa',
    component: EmpresaComponent,
  },
  {
    path: 'sucursal',
    component: SucursalComponent,
  },
  {
    path: 'genero',
    component: GeneroComponent,
  },
  {
    path: 'status_usuario',
    component: StatusUsuarioComponent,
  },
  {
    path: 'usuario',
    component: UsuarioComponent,
  },
  {
    path: 'role',
    component: RoleComponent,
  },
  {
    path: 'modulo',
    component: ModuloComponent,
  },
  {
    path: 'menu',
    component: MenuComponent,
  },
  {
    path: 'opcion',
    component: OpcionComponent,
  },
  {
    path: 'asignacion_opcion_role',
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