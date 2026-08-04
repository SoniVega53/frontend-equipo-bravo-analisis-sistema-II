import { Routes } from '@angular/router';
import { WelcomeComponent } from '../../ui/welcome/welcome.component';
import { EmpresaComponent } from '../../ui/console/empresa/empresa.component';
import { GeneroComponent } from '../../ui/console/genero/genero.component';
import { AccesoDenegadoComponent } from '../../ui/acceso-denegado/acceso-denegado.component';
import { NotFoundComponent } from '../../ui/not-found/not-found.component';

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
    path: 'genero',
    component: GeneroComponent,
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