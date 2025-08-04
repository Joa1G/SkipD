import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const premiumGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  // Verifica se o usuário está logado
  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }

  // Verifica se o usuário é premium
  if (!currentUser.isPremium) {
    // Mostra um alerta ou notificação
    alert('Esta funcionalidade é exclusiva para usuários premium!');

    // Redireciona para a página do usuário
    router.navigate(['/usuario']);
    return false;
  }

  return true;
};
