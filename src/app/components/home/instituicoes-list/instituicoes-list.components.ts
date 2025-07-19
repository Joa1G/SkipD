import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituicoesCardComponents } from '../instituicoes-card/instituicoes-card.components';
import { AbstractInstituicaoService } from '../../services/instituicao/abstract-instituicao.service';
import { AbstractMateriaService } from '../../services/materia/abstract-materia.service';

@Component({
  selector: 'app-instituicoes-list',
  imports: [CommonModule, InstituicoesCardComponents],
  templateUrl: './instituicoes-list.components.html',
  styleUrl: './instituicoes-list.components.scss',
})
export class InstituicoesListComponents {
  private serviceInstituicao = inject(AbstractInstituicaoService);
  instituicoes = this.serviceInstituicao.instituicoes;

  private serviceMateria = inject(AbstractMateriaService);
  materias = this.serviceMateria.materias;

}
