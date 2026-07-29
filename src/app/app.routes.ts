import { Routes } from '@angular/router';
import { LoginComponent } from './ui/login/login.component';
import { authGuard, loginGuard } from './core/guards/auth.guard';
import { HomeComponent } from './ui/home/home.component';
import { EmpresaComponent } from './ui/empresa/empresa.component';
import { GeneroComponent } from './ui/genero/genero.component';

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
        path: 'empresa',
        component: EmpresaComponent,
      },
      {
        path: 'genero',
        component: GeneroComponent,
      },
    ],
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' },
];
