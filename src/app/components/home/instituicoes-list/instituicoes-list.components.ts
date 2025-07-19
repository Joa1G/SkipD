import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituicoesCardComponents } from '../instituicoes-card/instituicoes-card.components';
import { MockedInstituicaoService } from '../../services/instituicao/mocked-instituicao.service';
import { MockedMateriaService } from '../../services/materia/mocked-materia.service';

@Component({
  selector: 'app-instituicoes-list',
  imports: [CommonModule, InstituicoesCardComponents],
  providers: [MockedInstituicaoService, MockedMateriaService],
  templateUrl: './instituicoes-list.components.html',
  styleUrl: './instituicoes-list.components.scss',
})
export class InstituicoesListComponents {
  private serviceInstituicao = inject(MockedInstituicaoService);
  instituicoes = this.serviceInstituicao.instituicoes;

  private serviceMateria = inject(MockedMateriaService);
  materias = this.serviceMateria.materias;

}
