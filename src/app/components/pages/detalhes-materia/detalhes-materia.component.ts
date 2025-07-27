import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { HeaderComponent } from '../../header/header.component';
import { Materia } from '../../../models/materia/materia.model';
import { Instituicao } from '../../../models/instituicao/instituicao.model';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-detalhes-materia',
  imports: [
    HeaderComponent,
    CommonModule,
    DialogComponent
  ],
  templateUrl: './detalhes-materia.component.html',
  styleUrl: './detalhes-materia.component.scss'
})
export class DetalhesMateriaComponent {
  private serviceMateria = inject(AbstractMateriaService);
  private serviceInstituicao = inject(AbstractInstituicaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  showDeleteDialog: boolean = false;
  showEditDialog: boolean = false;
  deleteRequested: boolean = false;

  materiaIdParam = this.route.snapshot.paramMap.get('id');
  materiaId = Number(this.materiaIdParam);

  materia?: Materia;
  instituicao?: Instituicao;

  semanaDays = [
    {id: 1, day: 'Dom', qtdHoras: 0},
    {id: 2, day: 'Seg', qtdHoras: 0},
    {id: 3, day: 'Ter', qtdHoras: 0},
    {id: 4, day: 'Qua', qtdHoras: 0},
    {id: 5, day: 'Qui', qtdHoras: 0},
    {id: 6, day: 'Sex', qtdHoras: 0},
    {id: 7, day: 'Sab', qtdHoras: 0}
  ];


  ngOnInit(): void {
    this.loadMateria();
  }
  private loadMateria(): void {
    this.serviceMateria.getMateriaById(this.materiaId).subscribe(result => {
      if (result.success && result.data) {
        this.materia = result.data;
        this.setSemanaDaysHours();
        this.loadInstituicao();
      } else {
        console.error('Erro ao carregar a matéria:', result.data || 'Dados não encontrados.');
      }
    });
  }

  private loadInstituicao(): void {
    if (!this.materia || !this.materia.idInstituicao) {
        console.error('ID da instituição não encontrado na matéria.');
        return;
    }
    this.serviceInstituicao.getInstituicaoById(this.materia.idInstituicao).subscribe(result => {
      if (result.success && result.data) {
        this.instituicao = result.data;
      } else {
        console.error('Erro ao carregar a instituição:', result.data || 'Dados não encontrados.');
      }
    });
  }

  private setSemanaDaysHours(): void {
    // Garante que a matéria e as aulas da semana existem
    if (!this.materia || !this.materia.aulasDaSemana) {
      return;
    }

    // Objeto para mapear a abreviação do dia (ex: 'Seg') para a chave no objeto aulasDaSemana (ex: 'segunda')
    const dayMap: { [key: string]: keyof Materia['aulasDaSemana'] } = {
        'Dom': 'domingo',
        'Seg': 'segunda',
        'Ter': 'terca',
        'Qua': 'quarta',
        'Qui': 'quinta',
        'Sex': 'sexta',
        'Sab': 'sabado'
    };

    // Itera sobre o array 'semanaDays' para atualizar os valores de 'qtdHoras'
    this.semanaDays.forEach(semanaDay => {
        const key = dayMap[semanaDay.day];
        // Acessa a propriedade correta usando this.materia.aulasDaSemana
        semanaDay.qtdHoras = this.materia!.aulasDaSemana[key];
    });
  }

  limiteFaltas(): number {
    return this.materia!.cargaHorariaTotal * this.instituicao!.percentual_limite_faltas;
  };

  async adicionarFalta(idMateria: number, quantidade: number) {
    await firstValueFrom(this.serviceMateria.addFalta(idMateria, quantidade));
  };

  async excluirMateria(): Promise<void> {
    await firstValueFrom(this.serviceMateria.deleteMateria(this.materiaId));
  };

  onClickDeleteMateria() {
    this.showDeleteDialog = true;
  };

  onClickEditMateria() {
    this.showEditDialog = true;
  };



}
