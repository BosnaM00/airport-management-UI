import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRole: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/search-flights']);
    return false;
  }

  if (auth.hasRole(allowedRole)) {
    return true;
  }

  // Redirect to the user's own dashboard
  const role = auth.getUserRole();
  router.navigate([role === 'PASSENGER' ? '/passenger-dashboard' : '/employee-dashboard']);
  return false;
};
