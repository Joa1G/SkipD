import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { CalendarWeeklyComponent } from './calendar-weekly/calendar-weekly.component';
import { InsightsService } from '../../../services/insights/insights.service';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CalendarWeeklyComponent],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent {
  private insightsService = inject(InsightsService);
  insights = this.insightsService.insights;

  get criticaMensagem() {
    const criticas = this.insights().materiasCriticas;
    if (criticas.length === 0) return 'Sem matérias em risco.';
    const nomes = criticas.map(m => m.nome).join(', ');
    return `Cuidado! Você está em risco de reprovação em: ${nomes}`;
  }

  get podeFaltarMensagem() {
    const dia = this.insights().diaMaisLeve;
    return dia ? `Você pode faltar com mais segurança em: ${dia.charAt(0).toUpperCase() + dia.slice(1)}` : '';
  }
}
