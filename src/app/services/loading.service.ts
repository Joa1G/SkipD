import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _isLoading = signal<boolean>(false);
  private _loadingMessage = signal<string>('Carregando...');
  private _requestCount = signal<number>(0);

  // Computed properties para exposição pública
  isLoading = computed(() => this._isLoading());
  loadingMessage = computed(() => this._loadingMessage());

  // Métodos para controlar o loading
  show(message: string = 'Carregando...'): void {
    this._loadingMessage.set(message);
    this._requestCount.update((count) => count + 1);
    this._isLoading.set(true);
  }

  hide(): void {
    this._requestCount.update((count) => Math.max(0, count - 1));

    // Só esconde o loading quando não há mais requests pendentes
    if (this._requestCount() === 0) {
      this._isLoading.set(false);
    }
  }

  // Método para forçar o hide (útil em casos de erro)
  forceHide(): void {
    this._requestCount.set(0);
    this._isLoading.set(false);
  }

  // Método utilitário para executar uma operação com loading
  async withLoading<T>(
    operation: () => Promise<T>,
    message: string = 'Carregando...'
  ): Promise<T> {
    this.show(message);
    try {
      const result = await operation();
      return result;
    } finally {
      this.hide();
    }
  }
}
