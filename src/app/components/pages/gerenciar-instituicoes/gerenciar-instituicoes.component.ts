import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { PremiumDialogComponent } from '../../shared/dialogs/premium-dialog/premium-dialog.component';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { firstValueFrom } from 'rxjs';
import { DialogComponent } from "../../shared/dialogs/dialog.component";
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';

@Component({
  selector: 'app-gerenciar-instituicoes',
  imports: [HeaderComponent, MatIcon, PremiumDialogComponent, RouterModule, DialogComponent],
  templateUrl: './gerenciar-instituicoes.component.html',
  styleUrl: './gerenciar-instituicoes.component.scss'
})
export class GerenciarInstituicoesComponent {

  private router = inject(Router);
  private authService = inject(MockedAuthService);
  private instituicaoService = inject(AbstractInstituicaoService);
  private materiasService = inject(AbstractMateriaService);

  showDeleteDialog: boolean = false;
  showCleanDialog: boolean = false;
  showSuccessDeleteInstituicao: boolean = false;
  showSuccessCleanInstituicao: boolean = false;
  selectedInstituicaoId: number | null = null;

  showDeleteMessage(instituicaoId: number) {
    this.selectedInstituicaoId = instituicaoId;
    this.showDeleteDialog = true;
  }

  showCleanMessage(instituicaoId: number) {
    this.selectedInstituicaoId = instituicaoId;
    this.showCleanDialog = true;
  }

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
          this.instituicaoService.getInstituicoesByUsuarioId(currentUser.id)
        );
      } catch (error) {
        console.error('Error loading user institutions:', error);
      }
    }
  }

  async deleteInstituicao(instituicaoId: number) {
    const materias = await firstValueFrom(this.materiasService.getMateriasByInstituicaoId(instituicaoId));

    if (materias.data.length > 0) {
      for (const materia of materias.data) {
        await firstValueFrom(this.materiasService.deleteMateria(materia.id));
      }
    }

    this.instituicaoService.deleteInstituicao(instituicaoId).subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Instituição deletada com sucesso');
          this.loadUserInstituicoes();
          this.showDeleteDialog = false;
          this.selectedInstituicaoId = null;
          this.showSuccessDeleteInstituicao = true;
        } else {
          console.error('Erro ao deletar instituição:', result.message);
        }
      },
      error: (error) => {
        console.error('Erro ao deletar instituição:', error);
      }
    });
  }

  async clearMaterias(instituicaoId: number) {
    const materias = await firstValueFrom(this.materiasService.getMateriasByInstituicaoId(instituicaoId));

    if (materias.data.length > 0) {
      for (const materia of materias.data) {
        await firstValueFrom(this.materiasService.deleteMateria(materia.id));
      }
    }

    this.showCleanDialog = false;
    this.selectedInstituicaoId = null;
    this.loadUserInstituicoes();
    this.showSuccessCleanInstituicao = true;
  }

}
