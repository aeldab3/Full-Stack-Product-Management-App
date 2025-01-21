import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(UserAuthService);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(req);
};
