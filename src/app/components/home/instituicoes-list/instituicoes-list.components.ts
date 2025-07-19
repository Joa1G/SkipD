import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstituicoesCardComponents } from '../instituicoes-card/instituicoes-card.components';
import { instituicoesMockedData } from '../../services/instituicao/mocked-instituicao.service';

@Component({
  selector: 'app-instituicoes-list',
  imports: [CommonModule, InstituicoesCardComponents],
  templateUrl: './instituicoes-list.components.html',
  styleUrl: './instituicoes-list.components.scss',
})
export class InstituicoesListComponents {
  instituicoes = instituicoesMockedData;
}
