import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar-weekly',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar-weekly.component.html',
  styleUrls: ['./calendar-weekly.component.scss']
})
export class CalendarWeeklyComponent {
  dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  eventos = [
    [], // Dom
    [],
    ['Programação Orientada a Objetos'],
    ['Matemática Discreta', 'Engenharia de Software', 'Desenvolvimento Web Full Stack'],
    ['Programação Orientada a Objetos', 'Engenharia de Software', 'Desenvolvimento Web Full Stack'],
    ['Engenharia de Software', 'Desenvolvimento Web Full Stack'],
    [] // Sáb
  ];
}
