import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MateriasCardComponents } from '../materias-card/materias-card.component';
import { AbstractInstituicaoService } from '../../../../services/instituicao/abstract-instituicao.service';
import { AbstractMateriaService } from '../../../../services/materia/abstract-materia.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../../services/auth/auth.service';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DialogComponent } from '../../../shared/dialogs/dialog.component';
import { Materia } from '../../../../models/materia/materia.model';
import { PremiumDialogComponent } from '../../../shared/dialogs/premium-dialog/premium-dialog.component';

@Component({
  selector: 'app-instituicoes-list',
  imports: [
    CommonModule,
    MateriasCardComponents,
    MatIcon,
    RouterModule,
    PremiumDialogComponent,
  ],
  templateUrl: './instituicoes-list.component.html',
  styleUrl: './instituicoes-list.component.scss',
})
export class InstituicoesListComponents {
  private serviceInstituicao = inject(AbstractInstituicaoService);

  private serviceMateria = inject(AbstractMateriaService);
  materias = this.serviceMateria.materias;

  authService = inject(AuthService);

  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  showPremiumDialog = false;

  instituicoesDoUsuario = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    const todasInstituicoes = this.serviceInstituicao.instituicoes();

    if (!currentUser) {
      return [];
    }

    const instituicoesDoUsuario = todasInstituicoes.filter(
      (instituicao) => instituicao.id_usuario === currentUser.id
    );

    // Se o usuário não for premium, retorna apenas a primeira instituição
    if (!this.isPremiumUser()) {
      return instituicoesDoUsuario.slice(0, 1);
    }

    return instituicoesDoUsuario;
  });

  ngOnInit() {
    this.loadUserInstituicoes();
  }

  private async loadUserInstituicoes() {
    const currentUser = this.authService.getCurrentUser();
    console.log('Carregando instituições do usuário:', currentUser?.id);

    if (currentUser) {
      try {
        const result = await firstValueFrom(
          this.serviceInstituicao.getInstituicoesByUsuarioId(currentUser.id)
        );
        console.log('Resultado carregamento instituições:', result);

        if (result.success) {
          // Atualizar o signal local
          await this.serviceInstituicao.refresh();
          // Carregar matérias após as instituições estarem carregadas
          await this.loadUserMaterias();
        }
      } catch (error) {
        console.error('Error loading user institutions:', error);
      }
    } else {
      console.error('Usuário não encontrado para carregar instituições');
    }
  }

  private async loadUserMaterias() {
    console.log('Carregando matérias do usuário...');
    try {
      // Carregar todas as matérias do usuário
      this.serviceMateria.refresh();
    } catch (error) {
      console.error('Error loading user subjects:', error);
    }
  }

  async addFalta(idMateria: number, quantidade: number) {
    try {
      const result = await firstValueFrom(
        this.serviceMateria.addFalta(idMateria, { quantidade })
      );
      if (result.success) {
        console.log('Falta adicionada com sucesso');
        // Recarregar as matérias para refletir a mudança
        await this.serviceMateria.refresh();
      } else {
        console.error('Erro ao adicionar falta:', result.data);
      }
    } catch (error) {
      console.error('Erro de rede ao adicionar falta:', error);
    }
  }

  getMateriasPorInstituicao(idInstituicao: number) {
    return this.materias().filter(
      (m: Materia) => m.idInstituicao === idInstituicao
    );
  }

  showPremiumMessage() {
    this.showPremiumDialog = true;
  }
}
