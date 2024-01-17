import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { filter, map } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let result = authService.isLogin$
    .pipe(
      filter(f => f !== null),
      map(authenticated => {
        switch (route.routeConfig?.path) {
          case 'auth':
            if (Boolean(authenticated)) {
              router.navigate(['/main']);
            }
            return !Boolean(authenticated);

          default:
            if (!Boolean(authenticated)) {
              router.navigate(['/noauth']);
            }
            return Boolean(authenticated);
        }
      }),
    );

  return result;
};

