import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { instituicoesMockedData } from '../services/instituicaoMockedData.services';
import { Instituicao, Materia } from '../models/instituicao.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-home.component',
  imports: [HeaderComponent, CommonModule, MatCardModule, MatIcon ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  instituicoes = instituicoesMockedData;

  setStatus(instituicao: Instituicao): void {
    instituicao.materia.forEach((materia: Materia) => {
      const percentualFaltas = (materia.faltas / materia.carga_horaria_total) * 100;

      if (percentualFaltas <= instituicao.percentual_limite_faltas) {
        materia.status = 'Aprovado';
      } else if (
        percentualFaltas > instituicao.percentual_limite_faltas &&
        percentualFaltas <= instituicao.percentual_limite_faltas + 10
      ) {
        materia.status = 'Risco';
      } else {
        materia.status = 'Reprovado';
      }
    });
  }
}
