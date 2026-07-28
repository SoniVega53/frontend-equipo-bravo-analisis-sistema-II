import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenValid()) {
    return true;
  }

  authService.logout();
  router.navigate(['/login']);
  return false;
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isLoggedIn = authService.isLoggedIn();
    if (!isLoggedIn) {
      return true;
    }
    router.navigate(['/home']);
    return false;
  } catch (e) {
    console.error('Error en loginGuard:', e);
    return true;
  }
};
