import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorDialogService } from '../../../services/error-dialog.service';

@Component({
  selector: 'app-error-examples',
  imports: [CommonModule],
  template: `
    <div class="error-examples">
      <h2>Exemplos de Diálogos de Erro</h2>

      <div class="button-group">
        <button (click)="showNetworkError()" class="error-btn">
          Erro de Rede
        </button>

        <button (click)="showValidationError()" class="error-btn">
          Erro de Validação
        </button>

        <button (click)="showServerError()" class="error-btn">
          Erro de Servidor
        </button>

        <button (click)="showAuthError()" class="error-btn">
          Erro de Autenticação
        </button>

        <button (click)="showNotFoundError()" class="error-btn">
          Não Encontrado
        </button>

        <button (click)="showGenericError()" class="error-btn">
          Erro Genérico
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .error-examples {
        padding: 2rem;
        max-width: 600px;
        margin: 0 auto;
      }

      .button-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }

      .error-btn {
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 6px;
        background-color: #f44336;
        color: white;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.2s ease;
      }

      .error-btn:hover {
        background-color: #d32f2f;
      }
    `,
  ],
})
export class ErrorExamplesComponent {
  private errorDialogService = inject(ErrorDialogService);

  showNetworkError() {
    this.errorDialogService.showNetworkError(() => {
      console.log('Tentando novamente...');
    });
  }

  showValidationError() {
    this.errorDialogService.showValidationError(
      'Os dados fornecidos são inválidos. Verifique os campos obrigatórios.',
      400
    );
  }

  showServerError() {
    this.errorDialogService.showServerError(500, () => {
      console.log('Tentando novamente após erro do servidor...');
    });
  }

  showAuthError() {
    this.errorDialogService.showAuthError();
  }

  showNotFoundError() {
    this.errorDialogService.showNotFoundError('matéria');
  }

  showGenericError() {
    this.errorDialogService.showGenericError(
      'Ocorreu um erro inesperado. Tente novamente mais tarde.',
      () => {
        console.log('Tentando operação novamente...');
      }
    );
  }
}
