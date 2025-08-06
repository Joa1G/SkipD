import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" [class.visible]="isVisible">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ message }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Carregando...';
}
