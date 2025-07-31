import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-weekly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-weekly.component.html',
  styleUrls: ['./calendar-weekly.component.scss']
})
export class CalendarWeeklyComponent {
  @Input() eventosPorDia: Record<string, string[]> = {};

  dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

  get eventosSemana(): string[][] {
    return this.dias.map(dia => this.eventosPorDia[dia] || []);
  }
}
