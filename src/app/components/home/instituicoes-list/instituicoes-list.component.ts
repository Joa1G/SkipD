import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituicoesCardComponents } from '../instituicoes-card/instituicoes-card.component';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';
import { firstValueFrom } from 'rxjs';
import { MockedAuthService } from '../../../services/auth/mocked-auth.service';

@Component({
  selector: 'app-instituicoes-list',
  imports: [CommonModule, InstituicoesCardComponents],
  templateUrl: './instituicoes-list.component.html',
  styleUrl: './instituicoes-list.component.scss',
})
export class InstituicoesListComponents {
  private serviceInstituicao = inject(AbstractInstituicaoService);

  private serviceMateria = inject(AbstractMateriaService);
  materias = this.serviceMateria.materias;

  authService = inject(MockedAuthService);

  instituicoesDoUsuario = computed(() => {
    const currentUser = this.authService.currentUser();
    const todasInstituicoes = this.serviceInstituicao.instituicoes();

    if(!currentUser) {
      return [];
    }

    return todasInstituicoes.filter(instituicao => instituicao.id_usuario === currentUser.id);
  });

  ngOnInit() {
    this.loadUserInstituicoes();
  }

  private async loadUserInstituicoes() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      try {
        await firstValueFrom(this.serviceInstituicao.getInstituicaoByUsuarioId(currentUser.id));
      } catch (error) {
        console.error('Error loading user institutions:', error);
      }
    }
  }

  async addFalta(idMateria: number, quantidade: number) {
    await firstValueFrom(this.serviceMateria.addFalta(idMateria, quantidade));
  }

  getMateriasPorInstituicao(idInstituicao: number) {
    return this.materias().filter((m) => m.idInstituicao === idInstituicao);
  }
}
