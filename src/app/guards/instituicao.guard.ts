import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AbstractInstituicaoService } from '../services/instituicao/abstract-instituicao.service';
import { catchError, of, map } from 'rxjs';

export const instituicaoGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const authService = inject(AuthService);
  const instituicaoService = inject(AbstractInstituicaoService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  const instituicaoId = Number(route.paramMap.get('id'));

  if (!instituicaoId || isNaN(instituicaoId)) {
    router.navigate(['/home']);
    return false;
  }

  return instituicaoService.getInstituicaoById(instituicaoId).pipe(
    map((result) => {
      if (!result.success || !result.data) {
        router.navigate(['/home']);
        return false;
      }

      const instituicao = result.data;

      const instituicaoPertenceAoUsuario =
        instituicao.id_usuario === currentUser.id;

      if (!instituicaoPertenceAoUsuario) {
        router.navigate(['/home']);
        return false;
      }

      return true;
    }),
    catchError(() => {
      router.navigate(['/home']);
      return of(false);
    })
  );
};
