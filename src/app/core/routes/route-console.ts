import { Routes } from '@angular/router';
import { WelcomeComponent } from '../../ui/welcome/welcome.component';
import { EmpresaComponent } from '../../ui/console/empresa/empresa.component';
import { GeneroComponent } from '../../ui/console/genero/genero.component';
import { AccesoDenegadoComponent } from '../../ui/acceso-denegado/acceso-denegado.component';
import { NotFoundComponent } from '../../ui/not-found/not-found.component';
import { AsignacionOpcionRoleComponent } from '../../ui/console/asignacion-opcion-role/asignacion-opcion-role.component';
import { UsuarioComponent } from '../../ui/console/usuario/usuario.component';
import { SucursalComponent } from '../../ui/console/sucursal/sucursal.component';

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
    path: 'usuario',
    component: UsuarioComponent,
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