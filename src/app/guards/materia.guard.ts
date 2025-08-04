import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AbstractMateriaService } from '../services/materia/abstract-materia.service';
import { AbstractInstituicaoService } from '../services/instituicao/abstract-instituicao.service';
import { catchError, of, map } from 'rxjs';

export const materiaGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const materiaService = inject(AbstractMateriaService);
  const instituicaoService = inject(AbstractInstituicaoService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  const materiaId = Number(route.paramMap.get('id'));

  if (!materiaId || isNaN(materiaId)) {
    router.navigate(['/home']);
    return false;
  }

  return materiaService.getMateriaById(materiaId).pipe(
    map((result) => {
      if (!result.success || !result.data) {
        router.navigate(['/home']);
        return false;
      }

      const materia = result.data;

      const instituicoesDoUsuario = instituicaoService
        .instituicoes()
        .filter((inst) => inst.id_usuario === currentUser.id);

      const materiaPertenceAoUsuario = instituicoesDoUsuario.some(
        (inst) => inst.id === materia.idInstituicao
      );

      if (!materiaPertenceAoUsuario) {
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
