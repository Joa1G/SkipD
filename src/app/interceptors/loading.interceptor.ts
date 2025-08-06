import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Lista de URLs que não devem mostrar loading (opcional)
  const excludedUrls: string[] = [
    // Adicione aqui URLs que não devem mostrar loading
    // '/api/some-frequent-endpoint'
  ];

  // Verifica se a URL deve ser excluída do loading
  const shouldShowLoading = !excludedUrls.some((url) => req.url.includes(url));

  if (shouldShowLoading) {
    // Define mensagem baseada no método HTTP
    let message = 'Carregando...';
    switch (req.method) {
      case 'POST':
        message = 'Salvando...';
        break;
      case 'PUT':
      case 'PATCH':
        message = 'Atualizando...';
        break;
      case 'DELETE':
        message = 'Excluindo...';
        break;
      default:
        message = 'Carregando...';
    }

    loadingService.show(message);
  }

  return next(req).pipe(
    finalize(() => {
      if (shouldShowLoading) {
        loadingService.hide();
      }
    })
  );
};
