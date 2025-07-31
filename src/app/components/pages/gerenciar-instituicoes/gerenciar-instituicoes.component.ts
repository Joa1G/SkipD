import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { PremiumDialogComponent } from '../../shared/dialogs/premium-dialog/premium-dialog.component';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-gerenciar-instituicoes',
  imports: [HeaderComponent, MatIcon, PremiumDialogComponent, RouterModule],
  templateUrl: './gerenciar-instituicoes.component.html',
  styleUrl: './gerenciar-instituicoes.component.scss'
})
export class GerenciarInstituicoesComponent {

  private router = inject(Router);
  private authService = inject(MockedAuthService);
  private instituicaoService = inject(AbstractInstituicaoService);

  ngOnInit() {
    this.loadUserInstituicoes();
  }

  isPremiumUser = computed(() => this.authService.currentUser()?.isPremium ?? false);

  showPremiumDialog = false;

  showPremiumMessage() {
    this.showPremiumDialog = true;
  }

  onClickBackArrow() {
    this.router.navigate(['/usuario']);
  }

  instituicoesDoUsuario = computed(() => {
    const currentUser = this.authService.currentUser();
    const todasInstituicoes = this.instituicaoService.instituicoes();

    if (!currentUser) {
      return [];
    }

    return todasInstituicoes.filter(
      (instituicao) => instituicao.id_usuario === currentUser.id
    );
  });

  private async loadUserInstituicoes() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      try {
        await firstValueFrom(
          this.instituicaoService.getInstituicaoByUsuarioId(currentUser.id)
        );
      } catch (error) {
        console.error('Error loading user institutions:', error);
      }
    }
  }

}
