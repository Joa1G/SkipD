import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-falta-selector-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule],
  templateUrl: './falta-selector-dialog.component.html',
  styleUrl: './falta-selector-dialog.component.scss',
})
export class FaltaSelectorDialogComponent {
  @Input() isVisible: boolean = false;
  @Input() materia: string = '';
  @Input() faltasAtuais: number = 0;
  @Input() faltasMaximas: number = 0;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() quantidadeSelecionada = new EventEmitter<number>();

  quantidadeFaltas: number = 1;

  get faltasDisponiveis(): number {
    return Math.max(0, this.faltasMaximas - this.faltasAtuais);
  }

  turnDialogVisible(): string {
    return this.isVisible ? 'is-visible' : '';
  }

  closeDialog(): void {
    this.isVisibleChange.emit(false);
    this.quantidadeFaltas = 1; // Reset para o valor padrão
  }

  confirmarAdicao(): void {
    if (
      this.quantidadeFaltas > 0 &&
      this.quantidadeFaltas <= this.faltasDisponiveis
    ) {
      this.quantidadeSelecionada.emit(this.quantidadeFaltas);
      this.closeDialog();
    }
  }

  incrementarQuantidade(): void {
    if (this.quantidadeFaltas < this.faltasDisponiveis) {
      this.quantidadeFaltas++;
    }
  }

  decrementarQuantidade(): void {
    if (this.quantidadeFaltas > 1) {
      this.quantidadeFaltas--;
    }
  }
}
