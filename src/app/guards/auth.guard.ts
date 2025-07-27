import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { MockedAuthService } from "../services/auth/mocked-auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(MockedAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(MockedAuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
