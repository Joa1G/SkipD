import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { CalendarWeeklyComponent } from './calendar-weekly/calendar-weekly.component';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CalendarWeeklyComponent],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent {

}
