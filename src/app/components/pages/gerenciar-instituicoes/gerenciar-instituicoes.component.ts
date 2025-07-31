import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { PremiumDialogComponent } from '../../shared/dialogs/premium-dialog/premium-dialog.component';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';

@Component({
  selector: 'app-gerenciar-instituicoes',
  imports: [HeaderComponent, MatIcon, PremiumDialogComponent, RouterModule],
  templateUrl: './gerenciar-instituicoes.component.html',
  styleUrl: './gerenciar-instituicoes.component.scss'
})
export class GerenciarInstituicoesComponent {

  private router = inject(Router);
  private authService = inject(MockedAuthService);

  isPremiumUser = computed(() => this.authService.currentUser()?.isPremium ?? false);

  showPremiumDialog = false;

  showPremiumMessage() {
    this.showPremiumDialog = true;
  }

  onClickBackArrow() {
    this.router.navigate(['/usuario']);
  }

}
