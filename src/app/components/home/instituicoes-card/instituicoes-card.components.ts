import { Component, Input } from '@angular/core';
import { Materia } from '../../models/instituicao.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-instituicoes-card',
  imports: [MatCardModule, CommonModule, MatProgressBar],
  templateUrl: './instituicoes-card.components.html',
  styleUrl: './instituicoes-card.components.scss'
})
export class InstituicoesCardComponents {
  @Input() materia: Materia | null = null;
  @Input() limiteFaltas: number = 0;

  getFaltasPercentage(): number {
    if (!this.materia || this.materia.carga_horaria_total === 0) {
      return 0;
    }
    return (this.materia.faltas / this.faltasPermitidas()) * 100;
  }

  faltasPermitidas(): number {
    if (!this.materia) return 0;
    return this.materia.carga_horaria_total * (this.limiteFaltas / 100);
  }

  getStatusClass(): string {
    if (!this.materia) return '';
    switch (this.materia.status.toLowerCase()) {
      case 'aprovado':
        return 'status-aprovado';
      case 'risco':
        return 'status-risco';
      case 'reprovado':
        return 'status-reprovado';
      default:
        return '';
    }
  }

  quantidadeFaltasRisco():number{
    if (!this.materia) return 0;
    return this.faltasPermitidas() * 0.75;
  }

  setStatus(faltas: number) {
    if (!this.materia) return;
    if (faltas == this.faltasPermitidas()) {
      this.materia.status = 'Reprovado';
    } else if (faltas >= this.quantidadeFaltasRisco()) {
      this.materia.status = 'Risco';
    } else {
      this.materia.status = 'Aprovado';
    }
  }

  addFalta() {
    if (this.materia) {
      this.materia.faltas++;
      this.setStatus(this.materia.faltas);
    }

  }

}
