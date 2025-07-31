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
  // Este Input para os eventos já estava correto.
  @Input() eventosPorDia: Record<string, string[]> = {};

  @Input() dias: string[] = [];

  // Este getter continua funcionando perfeitamente.
  // Ele vai usar a lista de 'dias' que for passada pelo pai.
  get eventosSemana(): string[][] {
    return this.dias.map(dia => this.eventosPorDia[dia] || []);
  }
}
