import { Routes } from '@angular/router';
import { WelcomeComponent } from '../../ui/welcome/welcome.component';
import { EmpresaComponent } from '../../ui/console/empresa/empresa.component';
import { GeneroComponent } from '../../ui/console/genero/genero.component';
import { AccesoDenegadoComponent } from '../../ui/acceso-denegado/acceso-denegado.component';
import { NotFoundComponent } from '../../ui/not-found/not-found.component';
import { AsignacionOpcionRoleComponent } from '../../ui/console/asignacion-opcion-role/asignacion-opcion-role.component';
import { SucursalComponent } from '../../ui/sucursal/sucursal.component';

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
    path: 'genero/:code',
    component: GeneroComponent,
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