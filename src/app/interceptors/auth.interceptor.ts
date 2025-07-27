import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MockedAuthService } from "../services/auth/mocked-auth.service";
import { catchError, switchMap, throwError } from "rxjs";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(MockedAuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401){
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
