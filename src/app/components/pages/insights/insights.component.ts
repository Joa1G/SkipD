import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { CalendarWeeklyComponent } from './calendar-weekly/calendar-weekly.component';
import { InsightsService } from '../../../services/insights/insights.service';
import { AbstractInsightsService } from '../../../services/insights/abstract-insights.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CalendarWeeklyComponent],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent {
  private insightsService = inject(AbstractInsightsService);
  insights = this.insightsService.insights;

  diasDaSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

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
    return `Estado crítico em: ${nomes}. Evite faltas a todo custo.`;
  }

  get podeFaltarMensagem() {
    const dia = this.insights().diaMaisLeve;
    return dia ? `Você pode faltar com mais segurança em: ${dia}` : '';
  }
}
