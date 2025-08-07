import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Materia } from '../../../../models/materia/materia.model';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { FaltaSelectorDialogComponent } from '../../../shared/dialogs/falta-selector-dialog/falta-selector-dialog.component';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-materias-card',
  imports: [
    MatCardModule,
    CommonModule,
    MatProgressBar,
    FaltaSelectorDialogComponent,
  ],
  templateUrl: './materias-card.component.html',
  styleUrl: './materias-card.component.scss',
})
export class MateriasCardComponents {
  @Input() materia: Materia | null = null;
  @Input() limiteFaltas: number = 0;
  @Output() faltaAdicionada = new EventEmitter<{
    idMateria: number;
    quantidade: number;
  }>();

  private authService = inject(AuthService);
  router = inject(Router);
  showFaltaDialog = false;

  isPremiumUser = computed(
    () => this.authService.currentUser()?.isPremium ?? false
  );

  faltasPercentage(): number {
    if (!this.materia || this.materia.cargaHorariaTotal === 0) {
      return 0;
    }
    return (this.materia.faltas / this.faltasPermitidas()) * 100;
  }

  faltasPermitidas(): number {
    if (!this.materia) return 0;
    return this.materia.cargaHorariaTotal * this.limiteFaltas;
  }

  getStatusClass(): string {
    if (!this.materia) return '';
    switch (this.materia.status.toLowerCase()) {
      case 'aprovado':
        return 'status-aprovado';
      case 'risco':
        return 'status-risco';
      case 'reprovado':
        return 'status-reprovado';
      default:
        return '';
    }
  }

  abrirDialogFalta(event: Event): void {
    event.stopPropagation();
    this.showFaltaDialog = true;
  }

  adicionarFalta(quantidade: number): void {
    if (!this.materia) return;
    this.faltaAdicionada.emit({ idMateria: this.materia.id, quantidade });
  }

  navigateToDetails(id: number) {
    this.router.navigate(['/detalhes-materia', id]);
  }
}
