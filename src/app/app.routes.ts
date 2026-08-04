import { Routes } from '@angular/router';
import { LoginComponent } from './ui/login/login.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { HomeComponent } from './ui/home/home.component';
import { EmpresaComponent } from './ui/console/empresa/empresa.component';
import { GeneroComponent } from './ui/console/genero/genero.component';
import { NotFoundComponent } from './ui/not-found/not-found.component';
import { WelcomeComponent } from './ui/welcome/welcome.component';
import { AccesoDenegadoComponent } from './ui/acceso-denegado/acceso-denegado.component';
import { ConsoleComponent } from './ui/console/console.component';
import { CONSOLE_ROUTES } from './core/routes/route-console';
import { PerfilComponent } from './ui/perfil/perfil.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'console',
        component: ConsoleComponent,
        children: CONSOLE_ROUTES,
      },
      {
        path: 'perfil',
        component: PerfilComponent,
      },
      {
        path: '',
        redirectTo: 'console',
        pathMatch: 'full',
      },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' },
];
