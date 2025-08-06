import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Materia } from '../../../../models/materia/materia.model';

@Component({
  selector: 'app-calendar-weekly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-weekly.component.html',
  styleUrls: ['./calendar-weekly.component.scss']
})
export class CalendarWeeklyComponent {
  @Input() eventosPorDia: Record<string, Materia[]> = {};

  @Input() dias: string[] = [];

  get eventosSemana(): Materia[][] {
    return this.dias.map(dia => this.eventosPorDia[dia] || []);
  }
}
