import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ErrorDialogConfig {
  title?: string;
  message: string;
  errorCode?: number;
  showTryAgain?: boolean;
  onRetry?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  private errorDialogSubject = new BehaviorSubject<ErrorDialogConfig | null>(
    null
  );
  public errorDialog$ = this.errorDialogSubject.asObservable();

  showError(config: ErrorDialogConfig) {
    this.errorDialogSubject.next(config);
  }

  hideError() {
    this.errorDialogSubject.next(null);
  }

  // Métodos de conveniência para diferentes tipos de erro
  showNetworkError(onRetry?: () => void) {
    this.showError({
      title: 'Erro de Conexão',
      message:
        'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
      showTryAgain: true,
      onRetry,
    });
  }

  showServerError(errorCode?: number, onRetry?: () => void) {
    this.showError({
      title: 'Erro do Servidor',
      message:
        'Ocorreu um erro interno no servidor. Tente novamente em alguns instantes.',
      errorCode: errorCode || 500,
      showTryAgain: true,
      onRetry,
    });
  }

  showValidationError(message: string, errorCode?: number) {
    this.showError({
      title: 'Dados Inválidos',
      message,
      errorCode: errorCode || 400,
      showTryAgain: false,
    });
  }

  showAuthError() {
    this.showError({
      title: 'Sessão Expirada',
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      errorCode: 401,
      showTryAgain: false,
    });
  }

  showNotFoundError(resource: string = 'recurso') {
    this.showError({
      title: 'Não Encontrado',
      message: `O ${resource} solicitado não foi encontrado.`,
      errorCode: 404,
      showTryAgain: false,
    });
  }

  showGenericError(message: string, onRetry?: () => void) {
    this.showError({
      title: 'Erro',
      message,
      showTryAgain: !!onRetry,
      onRetry,
    });
  }

  // Método para tratar erros HTTP automaticamente
  handleHttpError(error: any, onRetry?: () => void) {
    const status = error.status;
    const message =
      error.error?.message || error.message || 'Ocorreu um erro inesperado.';

    switch (status) {
      case 0:
        this.showNetworkError(onRetry);
        break;
      case 400:
        this.showValidationError(message, status);
        break;
      case 401:
        this.showAuthError();
        break;
      case 403:
        this.showError({
          title: 'Acesso Negado',
          message: 'Você não tem permissão para realizar esta ação.',
          errorCode: 403,
          showTryAgain: false,
        });
        break;
      case 404:
        this.showNotFoundError();
        break;
      case 422:
        this.showValidationError(message, status);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.showServerError(status, onRetry);
        break;
      default:
        this.showGenericError(message, onRetry);
    }
  }
}
