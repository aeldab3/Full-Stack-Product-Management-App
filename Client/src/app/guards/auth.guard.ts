import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let _userAuthService = inject(UserAuthService);
  let router = inject(Router);

  if (_userAuthService.getUserLogged()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
