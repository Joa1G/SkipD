import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Materia } from '../../../models/materia/materia.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-instituicoes-card',
  imports: [MatCardModule, CommonModule, MatProgressBar],
  templateUrl: './instituicoes-card.component.html',
  styleUrl: './instituicoes-card.component.scss',
})
export class InstituicoesCardComponents {
  @Input() materia: Materia | null = null;
  @Input() limiteFaltas: number = 0;
  @Output() faltaAdicionada = new EventEmitter<{ idMateria: number; quantidade: number }>();

  router = inject(Router);

  faltasPercentage(): number {
    if (!this.materia || this.materia.cargaHorariaTotal === 0) {
      return 0;
    }
    return (this.materia.faltas / this.faltasPermitidas()) * 100;
  }

  faltasPermitidas(): number {
    if (!this.materia) return 0;
    return this.materia.cargaHorariaTotal * this.limiteFaltas;
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

  adicionarFalta(qtd: number) {
    if (!this.materia) return;
    this.faltaAdicionada.emit({ idMateria: this.materia.id, quantidade: qtd });
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/detalhes-materia', id]);
  }
}
