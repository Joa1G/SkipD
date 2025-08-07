import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-falta-selector-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
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

  onQuantidadeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    // Se for um número válido, atualiza a quantidade
    if (!isNaN(value) && value > 0) {
      this.quantidadeFaltas = value;
    } else if (target.value === '' || target.value === '0') {
      // Se o campo estiver vazio ou for 0, define como 1
      this.quantidadeFaltas = 1;
    }

    // Sempre valida após a mudança
    this.validateQuantidade();
  }

  validateQuantidade(): void {
    // Garante que o valor está dentro dos limites
    if (this.quantidadeFaltas < 1) {
      this.quantidadeFaltas = 1;
    } else if (this.quantidadeFaltas > this.faltasDisponiveis) {
      this.quantidadeFaltas = this.faltasDisponiveis;
    }

    // Garante que seja um número inteiro
    this.quantidadeFaltas = Math.floor(this.quantidadeFaltas);
  }

  onKeyPress(event: KeyboardEvent): void {
    // Permite apenas números e teclas de controle (backspace, delete, etc.)
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'Home',
      'End',
      'ArrowLeft',
      'ArrowRight',
      'Clear',
      'Copy',
      'Paste',
    ];
    if (allowedKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Bloqueia qualquer tecla que não seja número
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }

  onFocus(event: Event): void {
    const target = event.target as HTMLInputElement;
    // Seleciona todo o texto quando o campo receber foco
    target.select();
  }
}
