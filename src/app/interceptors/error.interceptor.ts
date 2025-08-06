import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorDialogService } from '../services/error-dialog.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorDialogService = inject(ErrorDialogService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Ignorar erros que já foram tratados pelos serviços
        if (!req.headers.has('X-Skip-Error-Dialog')) {
          // Criar função de retry que reexecuta a requisição original
          const onRetry = () => {
            return next.handle(req).subscribe();
          };

          // Usar o serviço para exibir o erro apropriado
          this.errorDialogService.handleHttpError(error, onRetry);
        }

        // Relançar o erro para que os serviços possam tratá-lo também
        return throwError(() => error);
      })
    );
  }
}
