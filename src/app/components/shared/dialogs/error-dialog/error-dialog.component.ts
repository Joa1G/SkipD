import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-error-dialog',
  imports: [CommonModule, MatIcon],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss',
})
export class ErrorDialogComponent {
  @Input() title: string = 'Erro';
  @Input() message: string = '';
  @Input() isVisible: boolean = false;
  @Input() errorCode?: number;
  @Input() showTryAgain: boolean = true;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() tryAgain = new EventEmitter<void>();

  closeDialog() {
    this.isVisibleChange.emit(false);
  }

  onTryAgain() {
    this.tryAgain.emit();
    this.closeDialog();
  }

  turnDialogVisible() {
    return this.isVisible ? 'is-visible' : '';
  }

  getErrorIcon() {
    if (this.errorCode) {
      if (this.errorCode >= 500) {
        return 'dns'; // Erro de servidor
      } else if (this.errorCode === 404) {
        return 'search_off'; // Não encontrado
      } else if (this.errorCode === 401 || this.errorCode === 403) {
        return 'lock'; // Não autorizado
      } else if (this.errorCode >= 400) {
        return 'error_outline'; // Erro do cliente
      }
    }
    return 'error'; // Erro genérico
  }

  getErrorIconClass() {
    if (this.errorCode) {
      if (this.errorCode >= 500) {
        return 'error-icon--server';
      } else if (this.errorCode === 404) {
        return 'error-icon--not-found';
      } else if (this.errorCode === 401 || this.errorCode === 403) {
        return 'error-icon--auth';
      } else if (this.errorCode >= 400) {
        return 'error-icon--client';
      }
    }
    return 'error-icon--generic';
  }

  getIconContainerClass() {
    if (this.errorCode) {
      if (this.errorCode >= 500) {
        return 'error-dialog-icon--server';
      } else if (this.errorCode === 404) {
        return 'error-dialog-icon--not-found';
      } else if (this.errorCode === 401 || this.errorCode === 403) {
        return 'error-dialog-icon--auth';
      } else if (this.errorCode >= 400) {
        return 'error-dialog-icon--client';
      }
    }
    return 'error-dialog-icon--generic';
  }

  getErrorTitle() {
    if (this.title !== 'Erro') {
      return this.title;
    }

    if (this.errorCode) {
      switch (this.errorCode) {
        case 400:
          return 'Dados Inválidos';
        case 401:
          return 'Não Autorizado';
        case 403:
          return 'Acesso Negado';
        case 404:
          return 'Não Encontrado';
        case 422:
          return 'Dados Incorretos';
        case 500:
          return 'Erro do Servidor';
        case 502:
        case 503:
        case 504:
          return 'Serviço Indisponível';
        default:
          if (this.errorCode >= 500) {
            return 'Erro do Servidor';
          } else if (this.errorCode >= 400) {
            return 'Erro na Requisição';
          }
      }
    }
    return 'Erro';
  }
}
