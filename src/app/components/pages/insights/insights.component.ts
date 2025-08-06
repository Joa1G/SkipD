import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { CalendarWeeklyComponent } from './calendar-weekly/calendar-weekly.component';
import { AbstractInsightsService } from '../../../services/insights/abstract-insights.service';
import { AbstractInstituicaoService } from '../../../services/instituicao/abstract-instituicao.service';
import { AbstractMateriaService } from '../../../services/materia/abstract-materia.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CalendarWeeklyComponent],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})

export class InsightsComponent implements OnInit {
  private insightsService = inject(AbstractInsightsService);
  insights = this.insightsService.insights;

  private instituicaoService = inject(AbstractInstituicaoService);
  private materiaService = inject(AbstractMateriaService);

  diasDaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  async ngOnInit() {
    await this.instituicaoService.refresh();
    await this.materiaService.refresh();
  }

  get riscoMensagem() {
    const emRisco = this.insights().materiasEmRisco;
    if (emRisco.length === 0) return '';
    const nomes = emRisco.map(m => m.nome).join(', ');
    return `Cuidado! Você está em risco de reprovação em: ${nomes}.`;
  }

  get reprovadoMensagem() {
    const reprovadas = this.insights().materiasReprovadas;
    if (reprovadas.length === 0) return '';
    const nomes = reprovadas.map(m => m.nome).join(', ');
    return `Você esgotou seu limite de faltas em: ${nomes}.`;
  }

  get podeFaltarMensagem() {
    const dia = this.insights().diaMaisLeve;
    return dia ? `Você pode faltar com mais segurança em: ${dia}` : '';
  }
}
