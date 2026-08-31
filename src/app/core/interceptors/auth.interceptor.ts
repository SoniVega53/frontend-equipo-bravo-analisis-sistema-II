import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const esRutaPublica = req.url.includes('/api/auth/');

  if (esRutaPublica) {
    return next(req);
  }

  const token = authService.getToken();

  // Excluir Auth y esChangePassword de llevar Token
  const isAuthReq = req.url.includes('/api/auth/') || req.url.includes('/api/usuarios/esChangePassword');

  if (token && !isAuthReq) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq);
  }

  return next(req);
};