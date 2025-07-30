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
    ['Desenvolvimento Web Full Stack', 'Algoritmo e Estrutura de Dados I', 'Cálculo I'],
    ['Desenvolvimento Web Full Stack', 'Algoritmo e Estrutura de Dados I', 'Cálculo I'],
    ['Redes de Computadores'],
    ['Desenvolvimento Web Full Stack', 'Inteligência Artificial'],
    ['Desenvolvimento Web Full Stack', 'Banco de Dados'],
    [] // Sáb
  ];
}
