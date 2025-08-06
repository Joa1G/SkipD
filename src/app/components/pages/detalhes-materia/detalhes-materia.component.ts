import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { Materia } from '../../../models/materia/materia.model';
import { Instituicao } from '../../../models/instituicao/instituicao.model';
import { firstValueFrom } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { DialogComponent } from '../../shared/dialogs/dialog.component';
import { AuthService } from '../../../services/auth/auth.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-detalhes-materia',
  imports: [HeaderComponent, CommonModule, DialogComponent, MatIcon],
  templateUrl: './detalhes-materia.component.html',
  styleUrl: './detalhes-materia.component.scss',
})
export class DetalhesMateriaComponent {
  private serviceMateria = inject(AbstractMateriaService);
  private serviceInstituicao = inject(AbstractInstituicaoService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  showDeleteDialog: boolean = false;
  showEditDialog: boolean = false;
  deleteRequested: boolean = false;
  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  materiaIdParam = this.route.snapshot.paramMap.get('id');
  materiaId = Number(this.materiaIdParam);

  materia?: Materia;
  instituicao?: Instituicao;

  semanaDays = [
    { id: 1, day: 'Dom', qtdHoras: 0 },
    { id: 2, day: 'Seg', qtdHoras: 0 },
    { id: 3, day: 'Ter', qtdHoras: 0 },
    { id: 4, day: 'Qua', qtdHoras: 0 },
    { id: 5, day: 'Qui', qtdHoras: 0 },
    { id: 6, day: 'Sex', qtdHoras: 0 },
    { id: 7, day: 'Sab', qtdHoras: 0 },
  ];

  ngOnInit(): void {
    this.loadMateria();
  }

  private async loadMateria(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.serviceMateria.getMateriaById(this.materiaId)
      );

      if (result.success && result.data) {
        this.materia = result.data;
        this.setSemanaDaysHours();
        await this.loadInstituicao();
      } else {
        console.error(
          'Erro ao carregar a matéria:',
          result.data || 'Dados não encontrados.'
        );
      }
    } catch (error) {
      console.error('Erro de rede ao carregar matéria:', error);
    }
  }

  private async loadInstituicao(): Promise<void> {
    if (!this.materia || !this.materia.idInstituicao) {
      console.error('ID da instituição não encontrado na matéria.');
      return;
    }

    try {
      const result = await firstValueFrom(
        this.serviceInstituicao.getInstituicaoById(this.materia.idInstituicao)
      );

      if (result.success && result.data) {
        this.instituicao = result.data;
      } else {
        console.error(
          'Erro ao carregar a instituição:',
          result.data || 'Dados não encontrados.'
        );
      }
    } catch (error) {
      console.error('Erro de rede ao carregar instituição:', error);
    }
  }

  private setSemanaDaysHours(): void {
    // Garante que a matéria e as aulas da semana existem
    if (!this.materia || !this.materia.aulasDaSemana) {
      return;
    }

    // Objeto para mapear a abreviação do dia (ex: 'Seg') para a chave no objeto aulasDaSemana (ex: 'segunda')
    const dayMap: { [key: string]: keyof Materia['aulasDaSemana'] } = {
      Dom: 'domingo',
      Seg: 'segunda',
      Ter: 'terca',
      Qua: 'quarta',
      Qui: 'quinta',
      Sex: 'sexta',
      Sab: 'sabado',
    };

    // Itera sobre o array 'semanaDays' para atualizar os valores de 'qtdHoras'
    this.semanaDays.forEach((semanaDay) => {
      const key = dayMap[semanaDay.day];
      // Acessa a propriedade correta usando this.materia.aulasDaSemana
      semanaDay.qtdHoras = this.materia!.aulasDaSemana[key];
    });
  }

  limiteFaltas(): number {
    if (!this.materia || !this.instituicao) {
      return 0; // ou algum valor padrão
    }
    return (
      this.materia.cargaHorariaTotal * this.instituicao.percentual_limite_faltas
    );
  }

  async adicionarFalta(idMateria: number, quantidade: number) {
    try {
      const result = await firstValueFrom(
        this.serviceMateria.addFalta(idMateria, { quantidade })
      );
      if (result.success) {
        console.log('Falta adicionada com sucesso');
        // Recarregar os dados da matéria para refletir a mudança
        this.loadMateria();
        // Atualizar a lista global de matérias
        await this.serviceMateria.refresh();
      } else {
        console.error('Erro ao adicionar falta:', result.data);
      }
    } catch (error) {
      console.error('Erro de rede ao adicionar falta:', error);
    }
  }

  async excluirMateria(): Promise<void> {
    try {
      const result = await firstValueFrom(
        this.serviceMateria.deleteMateria(this.materiaId)
      );
      if (result.success) {
        console.log('Matéria excluída com sucesso');
        // Atualizar a lista global de matérias
        await this.serviceMateria.refresh();
        // Navegar de volta para a home
        this.router.navigate(['/home']);
      } else {
        console.error('Erro ao excluir matéria:', result.data);
      }
    } catch (error) {
      console.error('Erro de rede ao excluir matéria:', error);
    }
  }

  onClickDeleteMateria() {
    this.showDeleteDialog = true;
  }

  onClickEditMateria() {
    this.showEditDialog = true;
  }

  onClickBackArrow() {
    this.router.navigate(['/home']);
  }
}
